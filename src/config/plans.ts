export type PlanKey =
  | "free"
  | "starter"
  | "standard"
  | "fleetFree"
  | "fleetStarter";

export type PlanGroup = "merchant" | "fleet";

export interface PlanConfig {
  group: PlanGroup;
  monthlyFeeMinor: number;
  yearlyFeeMinor: number;
  commissionPercent: number;
  trialDays: number;
  popular?: boolean;
}

/**
 * Mirrors the active plans seeded in the business backend
 * (`priv/repo/seeds/subscription_plans.exs`). Keep prices and limits in sync
 * when a plan is changed in the Admin portal.
 */
export const PLAN_CONFIG: Record<PlanKey, PlanConfig> = {
  free: {
    group: "merchant",
    monthlyFeeMinor: 0,
    yearlyFeeMinor: 0,
    commissionPercent: 12,
    trialDays: 0,
  },
  starter: {
    group: "merchant",
    monthlyFeeMinor: 9_000,
    yearlyFeeMinor: 90_000,
    commissionPercent: 8,
    trialDays: 30,
  },
  standard: {
    group: "merchant",
    monthlyFeeMinor: 19_900,
    yearlyFeeMinor: 199_000,
    commissionPercent: 5,
    trialDays: 0,
    popular: true,
  },
  fleetFree: {
    group: "fleet",
    monthlyFeeMinor: 0,
    yearlyFeeMinor: 0,
    commissionPercent: 10,
    trialDays: 0,
  },
  fleetStarter: {
    group: "fleet",
    monthlyFeeMinor: 0,
    yearlyFeeMinor: 0,
    commissionPercent: 10,
    trialDays: 0,
  },
};

export const MERCHANT_PLANS: PlanKey[] = ["free", "starter", "standard"];
export const FLEET_PLANS: PlanKey[] = ["fleetFree", "fleetStarter"];

export type FeatureValue = boolean | number;

export const PLAN_VALUES: Record<PlanKey, Record<string, FeatureValue>> = {
  free: {
    onlineOrders: false,
    pos: true,
    menuItems: 5,
    members: 1,
    terminals: 1,
    promos: 0,
    analyticsOverview: true,
    salesTrends: true,
    channelSplit: true,
    teller: false,
    paymentMethods: false,
    orderTypes: false,
    hourly: false,
    export: false,
    scheduled: false,
    commission: 12,
  },
  starter: {
    onlineOrders: true,
    pos: true,
    menuItems: 15,
    members: 3,
    terminals: 2,
    promos: 3,
    analyticsOverview: true,
    salesTrends: true,
    channelSplit: true,
    teller: false,
    paymentMethods: false,
    orderTypes: false,
    hourly: false,
    export: false,
    scheduled: false,
    commission: 8,
  },
  standard: {
    onlineOrders: true,
    pos: true,
    menuItems: 100,
    members: 10,
    terminals: 5,
    promos: 10,
    analyticsOverview: true,
    salesTrends: true,
    channelSplit: true,
    teller: true,
    paymentMethods: true,
    orderTypes: true,
    hourly: true,
    export: true,
    scheduled: true,
    commission: 5,
  },
  fleetFree: {
    dispatch: false,
    riders: 1,
    vehicles: 1,
    members: 1,
    commission: 10,
  },
  fleetStarter: {
    dispatch: true,
    riders: 10,
    vehicles: 5,
    members: 3,
    commission: 10,
  },
};

export const MERCHANT_FEATURE_ROWS = [
  "onlineOrders",
  "pos",
  "menuItems",
  "members",
  "terminals",
  "promos",
  "analyticsOverview",
  "salesTrends",
  "channelSplit",
  "teller",
  "paymentMethods",
  "orderTypes",
  "hourly",
  "export",
  "scheduled",
  "commission",
] as const;

export const FLEET_FEATURE_ROWS = [
  "dispatch",
  "riders",
  "vehicles",
  "members",
  "commission",
] as const;

export function formatGhs(minor: number): string {
  return `GHS ${new Intl.NumberFormat("en-GH", {
    maximumFractionDigits: 0,
  }).format(minor / 100)}`;
}
