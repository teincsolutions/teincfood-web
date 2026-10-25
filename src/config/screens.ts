import {
  defaultDeviceForSurface,
  deviceIds,
  getDevice,
  type DeviceDef,
  type DeviceId,
  type DeviceSurface,
} from "./devices";

export type ScreenKey =
  // Buyer (Mobile)
  | "buyer:home"
  | "buyer:restaurant"
  | "buyer:cart"
  | "buyer:tracking"
  | "buyer:checkout"
  | "buyer:orders"
  | "buyer:dish"
  | "buyer:help"
  // Business (Mobile)
  | "business:orders"
  | "business:menu"
  | "business:earnings"
  | "business:dashboard"
  | "business:analytics"
  | "business:wallet"
  | "business:menus"
  | "business:pos-checkout"
  | "business:support-chat"
  | "business:operating-hours"
  | "business:delivery-settings"
  | "business:tax-settings"
  | "business:manage-categories"
  | "business:edit-menu"
  | "business:chat"
  | "business:details"
  // Rider
  | "rider:dashboard"
  | "rider:delivery"
  | "rider:earnings"
  | "rider:navigate-pickup"
  | "rider:navigate-dropoff"
  | "rider:vehicle"
  // Fleet (Mobile — placeholders, screenshots coming later)
  | "fleet:dashboard"
  | "fleet:rider-management"
  | "fleet:delivery-tracking"
  | "fleet:analytics"
  // Desktop
  | "desktop:dashboard"
  | "desktop:pos"
  | "desktop:pos-orders"
  | "desktop:kitchen"
  | "desktop:menu"
  | "desktop:menu-create"
  | "desktop:support"
  | "desktop:messages"
  | "desktop:team"
  | "desktop:delivery"
  | "desktop:orders"
  | "desktop:analytics"
  // WhatsApp
  | "whatsapp:chat";

export interface ScreenDef {
  key: ScreenKey;
  /** Translation path below showcase.screens. */
  labelKey: string;
  /** @deprecated Use labelKey with the showcase translations. */
  label: string;
  surface: DeviceSurface;
  /** Real screenshot asset path. Undefined = render branded placeholder. */
  image?: string;
  /** Device-specific screenshot overrides, keyed by DeviceId. */
  images?: Partial<Record<DeviceId, string>>;
  /** Intrinsic screenshot dimensions, used for stable responsive rendering. */
  width?: number;
  height?: number;
}

const mobile = (
  key: ScreenKey,
  labelKey: string,
  label: string,
  image?: string,
): ScreenDef => ({
  key,
  labelKey,
  label,
  surface: "mobile",
  image,
  width: 1170,
  height: 2532,
});

const desktop = (
  key: ScreenKey,
  labelKey: string,
  label: string,
  image: string,
  height = 2192,
): ScreenDef => ({
  key,
  labelKey,
  label,
  surface: "desktop",
  image,
  width: 3644,
  height,
});

export const screenRegistry: Record<ScreenKey, ScreenDef> = {
  // Buyer (Mobile)
   "buyer:home": { ...mobile("buyer:home", "buyer.home", "Discover restaurants", "/screens/mobile/home_browser_menus.PNG"), images: { ipad: "/screens/buyer/ipad/home.png", "android-tablet": "/screens/buyer/ipad/home.png" } },
  "buyer:restaurant": mobile("buyer:restaurant", "buyer.restaurant", "Browse menus", "/screens/mobile/home_browser_menus.PNG"),
  "buyer:cart": { ...mobile("buyer:cart", "buyer.cart", "Fast checkout", "/screens/mobile/cart_screen.PNG"), images: { ipad: "/screens/buyer/ipad/cart.png", "android-tablet": "/screens/buyer/ipad/cart.png" } },
  "buyer:tracking": mobile("buyer:tracking", "buyer.tracking", "Live delivery tracking", "/screens/mobile/track_my_order.PNG"),
  "buyer:checkout": { ...mobile("buyer:checkout", "buyer.checkout", "Secure checkout", "/screens/mobile/cart_checkout_scren.PNG"), images: { ipad: "/screens/buyer/ipad/checkout.png", "android-tablet": "/screens/buyer/ipad/checkout.png" } },
  "buyer:orders": { ...mobile("buyer:orders", "buyer.orders", "Order history", "/screens/mobile/my_orders_screen.PNG"), images: { ipad: "/screens/buyer/ipad/orders.png", "android-tablet": "/screens/buyer/ipad/orders.png" } },
  "buyer:dish": mobile("buyer:dish", "buyer.dish", "Dish details", "/screens/mobile/dish_details_screen_1.PNG"),
  "buyer:help": mobile("buyer:help", "buyer.help", "Help center", "/screens/mobile/help_center_screen.PNG"),
  // Business (Mobile)
  "business:orders": mobile("business:orders", "business.orders", "Order manager", "/screens/mobile/business/orders_screen.PNG"),
  "business:menu": mobile("business:menu", "business.menu", "Menu control", "/screens/mobile/business/menus_screen.PNG"),
  "business:earnings": mobile("business:earnings", "business.earnings", "Earnings & reports", "/screens/mobile/business/wallet_screen.PNG"),
  "business:dashboard": mobile("business:dashboard", "business.dashboard", "Business dashboard", "/screens/mobile/business/dashboard.PNG"),
  "business:analytics": mobile("business:analytics", "business.analytics", "Analytics & reports", "/screens/mobile/business/analytics_screen.PNG"),
  "business:wallet": mobile("business:wallet", "business.wallet", "Wallet & payouts", "/screens/mobile/business/wallet_screen.PNG"),
  "business:menus": mobile("business:menus", "business.menus", "Menu management", "/screens/mobile/business/menus_screen.PNG"),
  "business:pos-checkout": mobile("business:pos-checkout", "business.pos-checkout", "POS checkout", "/screens/mobile/business/pos_checkout_screen.PNG"),
  "business:support-chat": mobile("business:support-chat", "business.support-chat", "Support chat", "/screens/mobile/business/support_chat_screen.PNG"),
  "business:operating-hours": mobile("business:operating-hours", "business.operating-hours", "Operating hours", "/screens/mobile/business/operating_hours_settings.PNG"),
  "business:delivery-settings": mobile("business:delivery-settings", "business.delivery-settings", "Delivery settings", "/screens/mobile/business/delivery_settings_screen.PNG"),
  "business:tax-settings": mobile("business:tax-settings", "business.tax-settings", "Tax settings", "/screens/mobile/business/tax_setttings_screen.PNG"),
  "business:manage-categories": mobile("business:manage-categories", "business.manage-categories", "Manage categories", "/screens/mobile/business/manage_categories.PNG"),
  "business:edit-menu": mobile("business:edit-menu", "business.edit-menu", "Edit menu item", "/screens/mobile/business/edit_menu_1.PNG"),
  "business:chat": mobile("business:chat", "business.chat", "Chat & messages", "/screens/mobile/business/chat_screen.PNG"),
  "business:details": mobile("business:details", "business.details", "Business details", "/screens/mobile/business/business_details_screen.PNG"),
  // Rider
  "rider:dashboard": mobile("rider:dashboard", "rider.dashboard", "Rider dashboard", "/screens/mobile/rider/dashboard.PNG"),
  "rider:delivery": mobile("rider:delivery", "rider.delivery", "Accept deliveries", "/screens/mobile/rider/delivery_screen.PNG"),
  "rider:earnings": mobile("rider:earnings", "rider.earnings", "Earnings", "/screens/mobile/rider/earning_screen.PNG"),
  "rider:navigate-pickup": mobile("rider:navigate-pickup", "rider.navigate-pickup", "Navigate to pickup", "/screens/mobile/rider/navigate_to_pickup.PNG"),
  "rider:navigate-dropoff": mobile("rider:navigate-dropoff", "rider.navigate-dropoff", "Navigate to dropoff", "/screens/mobile/rider/navigate_to_dropoff.PNG"),
  "rider:vehicle": mobile("rider:vehicle", "rider.vehicle", "Vehicle info", "/screens/mobile/rider/vehicle_info.PNG"),
  // Fleet (Mobile — placeholders, screenshots coming later)
  "fleet:dashboard": mobile("fleet:dashboard", "fleet.dashboard", "Fleet dashboard"),
  "fleet:rider-management": mobile("fleet:rider-management", "fleet.rider-management", "Rider management"),
  "fleet:delivery-tracking": mobile("fleet:delivery-tracking", "fleet.delivery-tracking", "Delivery tracking"),
  "fleet:analytics": mobile("fleet:analytics", "fleet.analytics", "Fleet analytics"),
  // Desktop
  "desktop:dashboard": desktop("desktop:dashboard", "desktop.dashboard", "Business dashboard", "/screens/desktop/dashboard.png", 2206),
  "desktop:pos": desktop("desktop:pos", "desktop.pos", "POS terminal", "/screens/desktop/pos-checkout.png"),
  "desktop:pos-orders": desktop("desktop:pos-orders", "desktop.pos-orders", "POS order flow", "/screens/desktop/pos-orders.png"),
  "desktop:kitchen": desktop("desktop:kitchen", "desktop.kitchen", "Kitchen display", "/screens/desktop/kitchen-display.png"),
  "desktop:menu": desktop("desktop:menu", "desktop.menu", "Menu management", "/screens/desktop/menu-management.png"),
  "desktop:menu-create": desktop("desktop:menu-create", "desktop.menu-create", "Create menu item", "/screens/desktop/menu-create.png"),
  "desktop:support": desktop("desktop:support", "desktop.support", "AI support chat", "/screens/desktop/support-chat.png"),
  "desktop:messages": desktop("desktop:messages", "desktop.messages", "Messages", "/screens/desktop/messages.png"),
  "desktop:team": desktop("desktop:team", "desktop.team", "Team management", "/screens/desktop/team-management.png", 2210),
  "desktop:delivery": desktop("desktop:delivery", "desktop.delivery", "Delivery settings", "/screens/desktop/delivery-settings.png"),
  "desktop:orders": desktop("desktop:orders", "desktop.orders", "Orders listing", "/screens/desktop/orders-listing.png", 2210),
  "desktop:analytics": desktop("desktop:analytics", "desktop.analytics", "Analytics & reports", "/screens/desktop/analytics.png", 2210),
  // WhatsApp
  "whatsapp:chat": mobile("whatsapp:chat", "whatsapp.chat", "WhatsApp AI assistant", "/screens/mobile/whatapp_chat.PNG"),
};

/** Every screen key, in registry order. */
export const screenKeys = Object.keys(screenRegistry) as ScreenKey[];

/** Convenience accessor for components. */
export function getScreen(key: ScreenKey): ScreenDef {
  return screenRegistry[key];
}

export function isScreenKey(value: string): value is ScreenKey {
  return Object.prototype.hasOwnProperty.call(screenRegistry, value);
}

export function isScreenCompatible(screenKey: ScreenKey, deviceId: DeviceId): boolean {
  if (!deviceIds.includes(deviceId)) return false;
  return getScreen(screenKey).surface === getDevice(deviceId).surface;
}

/** Screen keys that can render on a given device, optionally scoped to a subset. */
export function getScreensForDevice(
  deviceId: DeviceId,
  keys: readonly ScreenKey[] = screenKeys,
): ScreenKey[] {
  const surface = getDevice(deviceId).surface;
  return keys.filter((key) => getScreen(key).surface === surface);
}

/** First screen in `keys` that the device can display. */
export function getDefaultScreen(
  deviceId: DeviceId,
  keys: readonly ScreenKey[] = screenKeys,
): ScreenKey | undefined {
  return keys.find((key) => isScreenCompatible(key, deviceId));
}

export function getDefaultDevice(
  screenKey: ScreenKey,
  allowedDevices: readonly DeviceId[] = deviceIds,
): DeviceId | undefined {
  const preferred = defaultDeviceForSurface(getScreen(screenKey).surface);
  if (allowedDevices.includes(preferred)) return preferred;
  return allowedDevices.find((device) => isScreenCompatible(screenKey, device));
}


export function getScreenImage(
  screen: ScreenDef,
  device: DeviceId | DeviceDef,
): string | undefined {
  const deviceId = typeof device === "string" ? device : device.id;
  return screen.images?.[deviceId] ?? screen.image;
}
