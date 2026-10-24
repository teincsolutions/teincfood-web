"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createLocalStorageAdapter, type Message, type ChatClient } from "@teincfood/chat-client";
import { MessageCircle, X, Send, Loader2, Maximize2, Minimize2, MapPin, RefreshCw } from "lucide-react";
import { MarkdownText } from "./MarkdownText";
import { chatConfig } from "@/config/site";

const API_BASE = chatConfig.apiBase;
const WS_BASE = chatConfig.wsBase;
const TURNSTILE_SITE_KEY = chatConfig.turnstileSiteKey;

function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("teinc_device_id");
  if (!id) {
    id = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2));
    localStorage.setItem("teinc_device_id", id);
  }
  return id;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<string>("disconnected");
  const [sessionReady, setSessionReady] = useState(false);
  const [sending, setSending] = useState(false);
  // Notice shown above the composer instead of a chat bubble: a failed
  // security check is not something the customer said, and repeating it in
  // the transcript made the chat look broken.
  const [notice, setNotice] = useState<{ kind: "captcha" | "session"; text: string } | null>(null);
  const clientRef = useRef<ChatClient | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const convIdRef = useRef<string | null>(null);
  // Captcha token + guest-session starter, kept in refs because the
  // Turnstile callback and the client bootstrap run in separate effects.
  const captchaTokenRef = useRef<string | null>(null);
  const startGuestRef = useRef<(() => Promise<void>) | null>(null);
  const sessionStartedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // No site key configured -> the captcha is not enforced on this
    // environment, so don't render an empty/broken Turnstile box.
    if (!TURNSTILE_SITE_KEY) return;
    if (!document.querySelector('script[src*="turnstile"]')) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    const interval = setInterval(() => {
      const w = (window as any).turnstile;
      if (w && turnstileRef.current && !turnstileRef.current.dataset.rendered) {
        turnstileRef.current.dataset.rendered = "1";
        try {
          const widgetId = w.render(turnstileRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            callback: (token: string) => {
              captchaTokenRef.current = token;
              setNotice(null);
              // Now that we have a token the guest session can be created.
              void startGuestRef.current?.();
            },
            "expired-callback": () => {
              captchaTokenRef.current = null;
            },
            "error-callback": (code: string) => {
              // e.g. 110200 = the site key is not allowed for this hostname.
              // Without this the widget would sit on "Verifying…" forever.
              console.warn("turnstile error", code);
              captchaTokenRef.current = null;
              setStatus("verifying");
              setNotice({
                kind: "captcha",
                text:
                  "The security check didn't load. Please reload the page, or tap Retry.",
              });
            },
            theme: "light",
          });
          turnstileWidgetIdRef.current = widgetId ?? null;
        } catch (e) {
          console.warn("turnstile render failed", e);
          setNotice({
            kind: "captcha",
            text: "The security check didn't load. Please reload the page, or tap Retry.",
          });
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  /**
   * Re-run the security check (and, when we already have a token, re-create
   * the guest session). Wired to the Retry button in the notice banner.
   */
  const retry = useCallback(async () => {
    setNotice(null);
    setStatus("verifying");
    const w = (window as any).turnstile;

    if (w && turnstileWidgetIdRef.current != null) {
      try {
        w.reset(turnstileWidgetIdRef.current);
      } catch {
        // reset() can throw if the widget is gone - fall through to the
        // token we may already hold.
      }
    }

    if (captchaTokenRef.current) {
      sessionStartedRef.current = false;
      await startGuestRef.current?.();
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storage = createLocalStorageAdapter(localStorage);
    // dynamic import to avoid SSR
    let cancelled = false;
    (async () => {
      const { ChatClient } = await import("@teincfood/chat-client");
      if (cancelled) return;
      const client = new ChatClient({
        baseUrl: API_BASE,
        wsUrl: WS_BASE,
        storage,
        surface: "web-guest",
        guestMode: true,
      });
      clientRef.current = client;

      client.on("connection:status", (c) => setStatus(String(c)));
      const sync = () => {
        const cid = convIdRef.current;
        const c = clientRef.current;
        if (!cid || !c) return;
        const stored = c.store.getMessages(cid);
        const pending = c.getPendingMessages(cid);
        const pendingMap = new Map<string, any>();
        for (const p of pending) pendingMap.set(`pending_${p._clientId}`, p);
        for (const m of stored) if (m.id) pendingMap.delete(`pending_${m.id}`);
        const all = [...stored, ...pendingMap.values()];
        all.sort((a: any, b: any) => {
          const aPending = "_clientId" in a ? 1 : 0;
          const bPending = "_clientId" in b ? 1 : 0;
          if (aPending !== bPending) return aPending - bPending;
          const aTime = new Date(a.inserted_at).getTime();
          const bTime = new Date(b.inserted_at).getTime();
          if (isNaN(aTime) && isNaN(bTime)) return 0;
          if (isNaN(aTime)) return 1;
          if (isNaN(bTime)) return -1;
          if (aTime !== bTime) return aTime - bTime;
          return (a.id ?? "").localeCompare(b.id ?? "");
        });
        setMessages(all as any);
        setPending([]);
      };
      client.on("message:sending", () => sync());
      client.on("message:sent", () => sync());
      client.on("message:received", () => sync());
      client.on("message:failed", () => sync());
      client.on("messages:loaded", (p: any) => { if (p.conversationId === convIdRef.current) sync(); });

      const deviceId = getDeviceId();

      // The backend only accepts a guest session with a valid captcha token
      // once GUEST_CAPTCHA_SECRET is configured, so the session must NOT be
      // started before the Turnstile widget has produced a token.
      const startGuestSession = async () => {
        if (sessionStartedRef.current) return;
        const token = captchaTokenRef.current;
        if (TURNSTILE_SITE_KEY && !token) return; // wait for the captcha
        sessionStartedRef.current = true;
        try {
          const convId = await client.startGuest(deviceId, token ?? undefined);
          convIdRef.current = convId;
          setUserId(client.getCurrentUserId());
          setSessionReady(true);
          try {
            await client.loadMessages(convId, 50, 0);
          } catch {
            // history load failed — the live socket still works
          }
          client.flushPending(convId);
          sync();
        } catch (e) {
          console.error("guest chat start failed", e);
          sessionStartedRef.current = false;
          setSessionReady(false);
          setStatus("verifying");
          setNotice({
            kind: "session",
            text:
              "We couldn't start the chat just now. Please tap Retry — your security check may need another go.",
          });
        }
      };

      // The Turnstile callback fires later (when the visitor opens the panel
      // and solves the challenge), so the starter is kept in a ref.
      startGuestRef.current = startGuestSession;

      if (!TURNSTILE_SITE_KEY) {
        // No captcha on this environment — connect straight away.
        await startGuestSession();
      } else {
        setStatus("verifying");
      }
    })();
    return () => { cancelled = true; clientRef.current?.stop(); };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  const send = useCallback(async () => {
    const client = clientRef.current;
    const convId = convIdRef.current;
    if (!client || !convId || !input.trim()) {
      if (client && !convId && input.trim()) {
        setNotice({
          kind: "captcha",
          text: "One moment — finish the security check above, then send your message.",
        });
      }
      return;
    }
    setSending(true);
    try {
      client.sendMessage(convId, input.trim());
      setInput("");
    } finally {
      setSending(false);
    }
  }, [input]);

  const quickActions = [
    { label: "Track my order", text: "I want to track my order" },
    { label: "Browse food near me", text: "Show me food near me" },
    { label: "Talk to a human", text: "I'd like to speak to a support agent" },
  ];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#ff7622] text-white shadow-lg hover:scale-105 transition-transform"
        aria-label="Open chat"
      >
        <MessageCircle size={26} />
      </button>
    );
  }

  return (
    <div
      className={
        expanded
          ? "fixed inset-3 z-50 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:inset-6"
          : "fixed bottom-4 right-4 z-50 flex h-[min(520px,calc(100dvh-5rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:bottom-6 sm:right-6"
      }
    >
      <div className="flex items-center justify-between bg-[#ff7622] px-4 py-3 text-white">
        <div>
          <p className="font-semibold">TeincFood Support</p>
          <p className="text-xs opacity-80">
            {status === "connected"
              ? "Online"
              : status === "error"
                ? "Unavailable"
                : status === "verifying"
                  ? "Verifying…"
                  : "Connecting…"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Minimise chat" : "Expand chat"}
            title={expanded ? "Minimise chat" : "Expand chat"}
            className="rounded-md p-1.5 transition-colors hover:bg-white/20"
          >
            {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            onClick={() => {
              setOpen(false);
              setExpanded(false);
            }}
            aria-label="Close chat"
            className="rounded-md p-1.5 transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
        {messages.map((m) => {
          const isOut = !!userId && m.sender_id === userId;
          return (
            <div key={m.id ?? (m as any)._clientId} className={`flex ${isOut ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${isOut ? "bg-[#ff7622] text-white" : "bg-white text-gray-900 shadow"}`}>
                <MarkdownText text={m.content} />
                <div className={`mt-1 text-[10px] ${isOut ? "text-white/70" : "text-gray-400"}`}>
                  {"_clientId" in m
                    ? (m as any).status === "failed"
                      ? "Failed — tap to retry"
                      : "Sending…"
                    : new Date(m.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                {"_clientId" in m && (m as any).status === "failed" && (
                  <button
                    onClick={() => {
                      const c = clientRef.current;
                      if (!c) return;
                      // Retry keeps the same _client_id so the server
                      // recognises it and does not create a duplicate.
                      c.retryPendingMessage((m as any)._clientId);
                    }}
                    className="mt-1 text-[10px] underline text-white/90"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {/* pending merged into messages list above */}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-gray-100 px-3 py-2">
        <button
          onClick={async () => {
            if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const c = clientRef.current;
                const cid = convIdRef.current;
                if (!c || !cid) return;
                c.sendMessage(cid, "Here is my location", {
                  location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
                  page_url: window.location.href,
                  page_title: document.title,
                });
              },
              (err) => alert("Could not get location: " + err.message),
            );
          }}
          className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
        >
          <MapPin size={13} className="mr-1 inline" aria-hidden />
          Share my location
        </button>
        {quickActions.map((q) => (
          <button
            key={q.label}
            onClick={() => { setInput(q.text); }}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
          >
            {q.label}
          </button>
        ))}
      </div>

      {TURNSTILE_SITE_KEY ? <div ref={turnstileRef} className="px-3 pt-2" /> : null}

      {notice && (
        <div className="flex items-start gap-2 border-t border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <p className="flex-1">{notice.text}</p>
          <button
            onClick={() => void retry()}
            className="flex shrink-0 items-center gap-1 rounded-full border border-amber-300 bg-white px-2 py-1 font-medium text-amber-900 hover:bg-amber-100"
          >
            <RefreshCw size={12} aria-hidden />
            Retry
          </button>
          <button
            onClick={() => setNotice(null)}
            aria-label="Dismiss notice"
            className="shrink-0 rounded-md p-1 text-amber-700 hover:bg-amber-100"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-gray-200 p-3">
        <input
          value={input}
          disabled={!sessionReady}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={sessionReady ? "Type a message…" : "Complete the security check above"}
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-[#ff7622] disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          onClick={send}
          disabled={sending || !input.trim() || !sessionReady}
          aria-label="Send message"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7622] text-white disabled:opacity-50"
        >
          {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}
