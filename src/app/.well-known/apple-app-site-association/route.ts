import { NextResponse } from "next/server";

/**
 * Apple universal-link association. Must be served from the link domain
 * (teincfood.com).
 *
 * - `/` opens the Teinc Food buyer app by default when installed.
 * - /biz and /order open the Teinc Food buyer app, including business QR
 *   codes (`/biz/<BUSINESS_NUMBER>`).
 * - /invite, /reset-password and /business open TF Business when installed.
 *
 * Values are env-driven (see .env.example); Apple Team ID and bundle IDs are
 * public by design. The two native apps are:
 *   - Teinc Food          -> com.teincfood.app
 *   - Teinc Food Business -> com.teincfood.business
 */
export async function GET() {
  const teamId = process.env.APPLE_TEAM_ID || "TEAMID";
  const businessBundleId =
    process.env.IOS_BUSINESS_BUNDLE_ID || "com.teincfood.business";
  const buyerBundleId =
    process.env.IOS_BUYER_BUNDLE_ID || "com.teincfood.app";

  return NextResponse.json(
    {
      applinks: {
        apps: [],
        details: [
          {
            appID: `${teamId}.${businessBundleId}`,
            paths: ["/invite*", "/reset-password*", "/business*"],
          },
          {
            appID: `${teamId}.${buyerBundleId}`,
            paths: ["/", "/biz*", "/order*", "/restaurant*", "/food*"],
          },
        ],
      },
      webcredentials: {
        apps: [`${teamId}.${buyerBundleId}`, `${teamId}.${businessBundleId}`],
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
