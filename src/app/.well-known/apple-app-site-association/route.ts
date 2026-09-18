import { NextResponse } from "next/server";

/**
 * Apple universal-link association. Must be served from the link domain
 * (food.teincsolutions.com).
 * - /invite and /reset-password open TF Business when installed.
 * - /biz opens the Teinc Food buyer app when installed.
 * Values are env-driven (see .env.example); Apple Team ID and bundle IDs are
 * public by design.
 */
export async function GET() {
  const teamId = process.env.APPLE_TEAM_ID || "TEAMID";
  const businessBundleId = process.env.IOS_BUSINESS_BUNDLE_ID || "com.teincfood.business";
  const buyerBundleId = process.env.IOS_BUYER_BUNDLE_ID || "com.teincfood.app";

  return NextResponse.json(
    {
      applinks: {
        apps: [],
        details: [
          {
            appID: `${teamId}.${businessBundleId}`,
            paths: ["/invite*", "/reset-password*"],
          },
          {
            appID: `${teamId}.${buyerBundleId}`,
            paths: ["/biz*"],
          },
        ],
      },
    },
    {
      headers: {
        // Apple accepts application/json for the association file.
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
}
