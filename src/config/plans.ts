/**
 * Presentation-only helpers for the plans page.
 *
 * Plan pricing, limits and availability come from the backend
 * (`src/lib/plans.ts`) — never from this file.
 */

export type FeatureValue = boolean | number;

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
