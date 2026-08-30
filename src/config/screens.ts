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
  label: string;
  /** Real screenshot asset path. Empty string = render branded placeholder. */
  image?: string;
}

export const screenRegistry: Record<ScreenKey, ScreenDef> = {
  // Buyer (Mobile)
  "buyer:home": { key: "buyer:home", label: "Discover restaurants", image: "/screens/mobile/home-modal.png" },
  "buyer:restaurant": { key: "buyer:restaurant", label: "Browse menus" },
  "buyer:cart": { key: "buyer:cart", label: "Fast checkout", image: "/screens/mobile/cart.png" },
  "buyer:tracking": { key: "buyer:tracking", label: "Live delivery tracking" },
  "buyer:checkout": { key: "buyer:checkout", label: "Secure checkout", image: "/screens/mobile/checkout.png" },
  "buyer:orders": { key: "buyer:orders", label: "Order history", image: "/screens/mobile/my-orders.png" },
  "buyer:dish": { key: "buyer:dish", label: "Dish details", image: "/screens/mobile/dish-jollof.png" },
  "buyer:help": { key: "buyer:help", label: "Help center", image: "/screens/mobile/help-center.png" },
  // Business (Mobile)
  "business:orders": { key: "business:orders", label: "Order manager", image: "/screens/mobile/business/orders_screen.PNG" },
  "business:menu": { key: "business:menu", label: "Menu control", image: "/screens/mobile/business/menus_screen.PNG" },
  "business:earnings": { key: "business:earnings", label: "Earnings & reports", image: "/screens/mobile/business/wallet_screen.PNG" },
  "business:dashboard": { key: "business:dashboard", label: "Business dashboard", image: "/screens/mobile/business/dashboard.PNG" },
  "business:analytics": { key: "business:analytics", label: "Analytics & reports", image: "/screens/mobile/business/analytics_screen.PNG" },
  "business:wallet": { key: "business:wallet", label: "Wallet & payouts", image: "/screens/mobile/business/wallet_screen.PNG" },
  "business:menus": { key: "business:menus", label: "Menu management", image: "/screens/mobile/business/menus_screen.PNG" },
  "business:pos-checkout": { key: "business:pos-checkout", label: "POS checkout", image: "/screens/mobile/business/pos_checkout_screen.PNG" },
  "business:support-chat": { key: "business:support-chat", label: "Support chat", image: "/screens/mobile/business/support_chat_screen.PNG" },
  "business:operating-hours": { key: "business:operating-hours", label: "Operating hours", image: "/screens/mobile/business/operating_hours_settings.PNG" },
  "business:delivery-settings": { key: "business:delivery-settings", label: "Delivery settings", image: "/screens/mobile/business/delivery_settings_screen.PNG" },
  "business:tax-settings": { key: "business:tax-settings", label: "Tax settings", image: "/screens/mobile/business/tax_setttings_screen.PNG" },
  "business:manage-categories": { key: "business:manage-categories", label: "Manage categories", image: "/screens/mobile/business/manage_categories.PNG" },
  "business:edit-menu": { key: "business:edit-menu", label: "Edit menu item", image: "/screens/mobile/business/edit_menu_1.PNG" },
  "business:chat": { key: "business:chat", label: "Chat & messages", image: "/screens/mobile/business/chat_screen.PNG" },
  "business:details": { key: "business:details", label: "Business details", image: "/screens/mobile/business/business_details_screen.PNG" },
  // Rider
  "rider:dashboard": { key: "rider:dashboard", label: "Rider dashboard", image: "/screens/mobile/rider/dashboard.PNG" },
  "rider:delivery": { key: "rider:delivery", label: "Accept deliveries", image: "/screens/mobile/rider/delivery_screen.PNG" },
  "rider:earnings": { key: "rider:earnings", label: "Earnings", image: "/screens/mobile/rider/earning_screen.PNG" },
  "rider:navigate-pickup": { key: "rider:navigate-pickup", label: "Navigate to pickup", image: "/screens/mobile/rider/navigate_to_pickup.PNG" },
  "rider:navigate-dropoff": { key: "rider:navigate-dropoff", label: "Navigate to dropoff", image: "/screens/mobile/rider/navigate_to_dropoff.PNG" },
  "rider:vehicle": { key: "rider:vehicle", label: "Vehicle info", image: "/screens/mobile/rider/vehicle_info.PNG" },
  // Fleet (Mobile — placeholders, screenshots coming later)
  "fleet:dashboard": { key: "fleet:dashboard", label: "Fleet dashboard" },
  "fleet:rider-management": { key: "fleet:rider-management", label: "Rider management" },
  "fleet:delivery-tracking": { key: "fleet:delivery-tracking", label: "Delivery tracking" },
  "fleet:analytics": { key: "fleet:analytics", label: "Fleet analytics" },
  // Desktop
  "desktop:dashboard": { key: "desktop:dashboard", label: "Business dashboard", image: "/screens/desktop/dashboard.png" },
  "desktop:pos": { key: "desktop:pos", label: "POS terminal", image: "/screens/desktop/pos-checkout.png" },
  "desktop:pos-orders": { key: "desktop:pos-orders", label: "POS order flow", image: "/screens/desktop/pos-orders.png" },
  "desktop:kitchen": { key: "desktop:kitchen", label: "Kitchen display", image: "/screens/desktop/kitchen-display.png" },
  "desktop:menu": { key: "desktop:menu", label: "Menu management", image: "/screens/desktop/menu-management.png" },
  "desktop:menu-create": { key: "desktop:menu-create", label: "Create menu item", image: "/screens/desktop/menu-create.png" },
  "desktop:support": { key: "desktop:support", label: "AI support chat", image: "/screens/desktop/support-chat.png" },
  "desktop:messages": { key: "desktop:messages", label: "Messages", image: "/screens/desktop/messages.png" },
  "desktop:team": { key: "desktop:team", label: "Team management", image: "/screens/desktop/team-management.png" },
  "desktop:delivery": { key: "desktop:delivery", label: "Delivery settings", image: "/screens/desktop/delivery-settings.png" },
  "desktop:orders": { key: "desktop:orders", label: "Orders listing", image: "/screens/desktop/orders-listing.png" },
  "desktop:analytics": { key: "desktop:analytics", label: "Analytics & reports", image: "/screens/desktop/analytics.png" },
  // WhatsApp
  "whatsapp:chat": { key: "whatsapp:chat", label: "WhatsApp AI assistant", image: "/screens/mobile/whatsapp-chat.png" },
};

/** Convenience accessor for components. */
export function getScreen(key: ScreenKey): ScreenDef {
  return screenRegistry[key];
}