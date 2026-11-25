/**
 * Server-side plan catalogue.
 *
 * Plans are managed in the admin portal, not in the website source. The site
 * reads the active plans from the backend on every (cached) render so price,
 * limits and new tiers appear without a code change or redeploy.
 */

import { apiUrl } from "@/lib/api-base";
import type { FeatureValue } from "@/config/plans";

export type PlanGroup = "merchant" | "fleet";

export interface SitePlan {
  id: string;
  slug: string;
  name: string;
  group: PlanGroup;
  monthlyFeeMinor: number;
  yearlyFeeMinor: number;
  commissionPercent: number;
  trialDays: number;
  values: Record<string, FeatureValue>;
  popular: boolean;
}

interface ApiPlan {
  id?: string;
  slug?: string;
  name?: string;
  business_type?: string;
  monthly_fee_minor?: number;
  yearly_fee_minor?: number;
  commission_rate_percent?: number;
  trial_days?: number;
  is_active?: boolean;
  features?: Record<string, unknown>;
}

function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function bool(value: unknown): boolean {
  return value === true;
}

function planValues(plan: ApiPlan): Record<string, FeatureValue> {
  const f = plan.features ?? {};
  if (plan.business_type === "delivery_provider") {
    return {
      dispatch: bool(f["fleet.dispatch"]),
      riders: num(f["limits.riders"]),
      vehicles: num(f["limits.vehicles"]),
      members: num(f["limits.members"]),
      commission: num(plan.commission_rate_percent),
    };
  }

  return {
    onlineOrders: bool(f["seller.online_orders"]),
    pos: bool(f["seller.pos.terminal"]),
    menuItems: num(f["limits.menu_items"]),
    members: num(f["limits.members"]),
    terminals: num(f["limits.terminals_linked"]),
    promos: num(f["limits.promo_active"]),
    analyticsOverview: bool(f["analytics.overview"]),
    salesTrends: bool(f["analytics.sales_trends"]),
    channelSplit: bool(f["analytics.channel_split"]),
    teller: bool(f["analytics.teller_performance"]),
    paymentMethods: bool(f["analytics.payment_methods"]),
    orderTypes: bool(f["analytics.order_types"]),
    hourly: bool(f["analytics.hourly_heatmap"]),
    export: bool(f["analytics.export"]),
    scheduled: bool(f["analytics.scheduled_reports"]),
    commission: num(plan.commission_rate_percent),
  };
}

export async function fetchSitePlans(): Promise<SitePlan[]> {
  try {
    const res = await fetch(apiUrl("/public/subscription-plans"), {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: ApiPlan[] };
    const rows = Array.isArray(json?.data) ? json.data : [];

    return rows
      .filter((plan) => plan && plan.is_active !== false)
      .map((plan) => ({
        id: String(plan.id ?? ""),
        slug: String(plan.slug ?? ""),
        name: String(plan.name ?? ""),
        group:
          plan.business_type === "delivery_provider" ? "fleet" : "merchant",
        monthlyFeeMinor: num(plan.monthly_fee_minor),
        yearlyFeeMinor: num(plan.yearly_fee_minor),
        commissionPercent: num(plan.commission_rate_percent),
        trialDays: num(plan.trial_days),
        values: planValues(plan),
        // Cosmetic badge only — all data above comes from the backend.
        popular: plan.slug === "standard",
      }));
  } catch {
    // An API outage must not take the page down; it simply renders no plans.
    return [];
  }
}
