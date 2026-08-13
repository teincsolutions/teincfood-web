const API_BASE = (
  process.env.TEINCFOOD_API_BASE_URL || "http://localhost:4000/api/v1"
).replace(/\/+$/, "");

export interface ContentPage {
  id: string;
  slug: string;
  locale: string;
  title: string;
  meta_description: string | null;
  sections: ContentSection[];
  updated_at: string;
}

export interface ContentSection {
  heading: string;
  body: string;
  order: number;
  type?: "faq";
  category?: string;
}

function isContentSection(value: unknown): value is ContentSection {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.heading === "string" && typeof v.body === "string";
}

function normalizePage(value: unknown): ContentPage | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (typeof v.title !== "string" || !Array.isArray(v.sections)) return null;
  if (v.sections.some((s) => !isContentSection(s))) return null;

  return {
    id: typeof v.id === "string" ? v.id : "",
    slug: typeof v.slug === "string" ? v.slug : "",
    locale: typeof v.locale === "string" ? v.locale : "en",
    title: v.title,
    meta_description:
      typeof v.meta_description === "string" ? v.meta_description : null,
    sections: v.sections as ContentSection[],
    updated_at: typeof v.updated_at === "string" ? v.updated_at : "",
  };
}

export async function getPage(
  slug: string,
  locale: string = "en"
): Promise<ContentPage | null> {
  try {
    const res = await fetch(
      `${API_BASE}/pages/${slug}?locale=${locale}`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: unknown };
    return normalizePage(json.data);
  } catch {
    return null;
  }
}
