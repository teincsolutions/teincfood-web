/**
 * Desktop release metadata for the public Download page.
 *
 * The installers live in a public repository (source stays private). The page
 * reads the newest published release from the GitHub API and maps its assets
 * to the platforms we support, so a new tag updates the website with no code
 * change.
 */

export type DownloadKind =
  | "windows"
  | "macos-universal"
  | "macos-arm"
  | "macos-intel"
  | "linux-appimage"
  | "linux-deb";

export interface DownloadAsset {
  kind: DownloadKind;
  name: string;
  url: string;
  size: number;
  /** Release tag/version the installer came from. */
  tag: string;
  version: string;
  publishedAt: string | null;
}

export interface DesktopRelease {
  tag: string;
  version: string;
  publishedAt: string | null;
  notes: string;
  prerelease: boolean;
  assets: DownloadAsset[];
}

export const DESKTOP_RELEASES_REPO =
  process.env.TEINCFOOD_DESKTOP_RELEASES_REPO ||
  "teincsolutions/teincfood-desktop-releases";

const LABELS: Record<DownloadKind, string> = {
  windows: "Windows",
  "macos-universal": "macOS (Apple Silicon + Intel)",
  "macos-arm": "macOS (Apple Silicon)",
  "macos-intel": "macOS (Intel)",
  "linux-appimage": "Linux (AppImage)",
  "linux-deb": "Linux (Debian/Ubuntu)",
};

export function assetLabel(kind: DownloadKind): string {
  return LABELS[kind];
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${Math.round(bytes / 1024)} KB`;
  return `${mb.toFixed(1)} MB`;
}

function classify(name: string): DownloadKind | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".exe") || lower.endsWith(".msi")) return "windows";
  if (lower.endsWith(".dmg")) {
    // The desktop build is a universal binary (aarch64 + x86_64) and Tauri
    // names the bundle `..._universal.dmg`. It must not be mistaken for an
    // Intel-only build just because the filename lacks an arch suffix.
    if (lower.includes("universal")) return "macos-universal";
    return lower.includes("aarch64") || lower.includes("arm64")
      ? "macos-arm"
      : "macos-intel";
  }
  if (lower.endsWith(".appimage")) return "linux-appimage";
  if (lower.endsWith(".deb")) return "linux-deb";
  return null;
}

export async function getLatestDesktopRelease(): Promise<DesktopRelease | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${DESKTOP_RELEASES_REPO}/releases?per_page=100`,
      { headers, next: { revalidate: 300 } },
    );
    if (!response.ok) return null;

    const releases = (await response.json()) as Array<{
      tag_name?: string;
      name?: string;
      body?: string;
      draft?: boolean;
      prerelease?: boolean;
      published_at?: string;
      created_at?: string;
      assets?: Array<{ name?: string; size?: number; browser_download_url?: string }>;
    }>;

    if (!Array.isArray(releases) || releases.length === 0) return null;

    // GitHub orders this endpoint by creation date. A production release can
    // be drafted days before it is published, so it may sit behind newer test
    // builds. Sort by publish time to always pick the newest stable release.
    const sorted = [...releases].sort((a, b) => {
      const aPublished = Date.parse(a.published_at ?? a.created_at ?? "") || 0;
      const bPublished = Date.parse(b.published_at ?? b.created_at ?? "") || 0;
      return bPublished - aPublished;
    });

    // The public download page is production-only: ignore drafts, GitHub
    // prereleases, and any tag explicitly marked as a test build. Feed-only
    // releases (updater-test/latest.json) are excluded by the asset check.
    const installable = sorted.filter(
      (item) =>
        !item.draft &&
        !item.prerelease &&
        !(item.tag_name ?? "").toLowerCase().includes("-test") &&
        (item.assets ?? []).some(
          (asset) => asset.name && classify(asset.name) !== null,
        ),
    );

    if (installable.length === 0) return null;

    const release = installable[0];

    // Platforms can ship on different schedules (for example a macOS-only
    // local build followed by a full cross-platform release). Keep the primary
    // button for the detected platform, but fill the "All installers" list
    // with the latest available asset for every platform across recent
    // stable releases instead of hiding platforms missing from the newest one.
    const ordered = installable;
    const seen = new Set<DownloadKind>();
    const assets: DownloadAsset[] = [];

    for (const item of ordered) {
      const tag = item.tag_name ?? "";
      const version = tag.replace(/^v/, "");
      const publishedAt = item.published_at ?? item.created_at ?? null;

      for (const asset of item.assets ?? []) {
        if (!asset.name || !asset.browser_download_url) continue;
        const kind = classify(asset.name);
        if (!kind || seen.has(kind)) continue;
        seen.add(kind);
        assets.push({
          kind,
          name: asset.name,
          url: asset.browser_download_url,
          size: asset.size ?? 0,
          tag,
          version,
          publishedAt,
        });
      }
    }

    if (assets.length === 0) return null;

    return {
      tag: release.tag_name ?? "",
      version: (release.tag_name ?? "").replace(/^v/, ""),
      publishedAt: release.published_at ?? release.created_at ?? null,
      notes: release.body ?? "",
      prerelease: Boolean(release.prerelease),
      assets,
    };
  } catch {
    return null;
  }
}
