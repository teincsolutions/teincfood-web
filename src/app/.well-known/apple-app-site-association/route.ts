import { NextResponse } from "next/server";

/**
 * Apple universal-link association. Must be served from the link domain
 * (food.teincsolutions.com) so /invite?code= opens TF Business when installed.
 * Values are env-driven (see .env.example); Apple Team ID and bundle ID are
 * public by design.
 */
export async function GET() {
  const teamId = process.env.APPLE_TEAM_ID || "TEAMID";
  const bundleId = process.env.IOS_BUSINESS_BUNDLE_ID || "com.teincfood.business";

  return NextResponse.json(
    {
      applinks: {
        apps: [],
        details: [
          {
            appID: `${teamId}.${bundleId}`,
            paths: ["/invite*", "/reset-password*"],
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
