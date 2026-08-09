const API_BASE = process.env.TEINCFOOD_API_BASE_URL ?? "http://localhost:4000/api/v1";

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

export async function getPage(
  slug: string,
  locale: string = "en"
): Promise<ContentPage | null> {
  try {
    const res = await fetch(
      `${API_BASE}/pages/${slug}?locale=${locale}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}
