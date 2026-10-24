"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createLocalStorageAdapter, type Message, type ChatClient } from "@teincfood/chat-client";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { MarkdownText } from "./MarkdownText";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://testing-food.teincsolutions.com/api/v1";
const WS_BASE = process.env.NEXT_PUBLIC_WS_URL ?? "wss://testing-food.teincsolutions.com/ws";

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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<string>("disconnected");
  const [sending, setSending] = useState(false);
  const clientRef = useRef<ChatClient | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const convIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
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
          w.render(turnstileRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
            callback: (token: string) => setTurnstileToken(token),
            "expired-callback": () => setTurnstileToken(null),
            theme: "light",
          });
        } catch (e) {
          console.warn("turnstile render failed", e);
        }
      }
    }, 500);
    return () => clearInterval(interval);
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
      try {
        const convId = await client.startGuest(deviceId, turnstileToken ?? undefined);
        convIdRef.current = convId;
        setUserId(client.getCurrentUserId());
        try { await client.loadMessages(convId, 50, 0); } catch {}
        sync();
      } catch (e) {
        console.error("guest chat start failed", e);
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
    if (!client || !convId || !input.trim()) return;
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
    <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-[#ff7622] px-4 py-3 text-white">
        <div>
          <p className="font-semibold">TeincFood Support</p>
          <p className="text-xs opacity-80">{status === "connected" ? "Online" : "Connecting…"}</p>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Close chat">
          <X size={20} />
        </button>
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
                      const cid = convIdRef.current;
                      if (!c || !cid) return;
                      c.removePendingMessage((m as any)._clientId);
                      c.sendMessage(cid, (m as any).content, (m as any).metadata ?? null);
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
          📍 Share my location
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

      <div ref={turnstileRef} className="px-3 pt-2" />
      <div className="flex items-center gap-2 border-t border-gray-200 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Type a message…"
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-[#ff7622]"
        />
        <button
          onClick={send}
          disabled={sending || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7622] text-white disabled:opacity-50"
        >
          {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}
