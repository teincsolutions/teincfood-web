import { NextResponse } from "next/server";

/**
 * Android App Links association. Must be served from the link domain
 * (food.teincsolutions.com) so /invite?code= opens TF Business when installed.
 * SHA-256 fingerprints are public by design (also in the Play Console).
 */
export async function GET() {
  const packageName =
    process.env.ANDROID_BUSINESS_PACKAGE || "com.teincfood.business";
  const fingerprints = (process.env.ANDROID_SHA256_FINGERPRINTS || "")
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  return NextResponse.json(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: packageName,
          sha256_cert_fingerprints: fingerprints,
        },
      },
    ],
    {
      headers: { "Cache-Control": "public, max-age=86400" },
    },
  );
}
