export type ScreenKey =
  | "buyer:home"
  | "buyer:restaurant"
  | "buyer:cart"
  | "buyer:tracking"
  | "business:orders"
  | "business:menu"
  | "business:earnings"
  | "rider:delivery";

export interface ScreenDef {
  key: ScreenKey;
  label: string;
  /** Real screenshot asset path. Empty string = render branded placeholder. */
  image?: string;
}

export const screenRegistry: Record<ScreenKey, ScreenDef> = {
  "buyer:home": { key: "buyer:home", label: "Discover restaurants" },
  "buyer:restaurant": { key: "buyer:restaurant", label: "Browse menus" },
  "buyer:cart": { key: "buyer:cart", label: "Fast checkout" },
  "buyer:tracking": { key: "buyer:tracking", label: "Live delivery tracking" },
  "business:orders": { key: "business:orders", label: "Order manager" },
  "business:menu": { key: "business:menu", label: "Menu control" },
  "business:earnings": { key: "business:earnings", label: "Earnings & reports" },
  "rider:delivery": { key: "rider:delivery", label: "Accept deliveries" },
};

/** Convenience accessor for components. */
export function getScreen(key: ScreenKey): ScreenDef {
  return screenRegistry[key];
}