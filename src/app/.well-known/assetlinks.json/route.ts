import { NextResponse } from "next/server";

/**
 * Android App Links association. Must be served from the link domain
 * (food.teincsolutions.com) so deep links open the matching native app:
 *   - Teinc Food          -> com.teincfood.app
 *   - Teinc Food Business -> com.teincfood.business
 *
 * SHA-256 fingerprints are public by design (also in the Play Console).
 * Use ANDROID_BUYER_SHA256_FINGERPRINTS and/or
 * ANDROID_BUSINESS_SHA256_FINGERPRINTS; ANDROID_SHA256_FINGERPRINTS is the
 * shared fallback when both apps use the same signing key.
 */
function fingerprints(primary: string | undefined, fallback: string | undefined) {
  return (primary || fallback || "")
    .split(",")
    .map((fingerprint) => fingerprint.trim())
    .filter(Boolean);
}

export async function GET() {
  const buyerPackage =
    process.env.ANDROID_BUYER_PACKAGE || "com.teincfood.app";
  const businessPackage =
    process.env.ANDROID_BUSINESS_PACKAGE || "com.teincfood.business";
  const shared = process.env.ANDROID_SHA256_FINGERPRINTS;
  const buyer = fingerprints(
    process.env.ANDROID_BUYER_SHA256_FINGERPRINTS,
    shared,
  );
  const business = fingerprints(
    process.env.ANDROID_BUSINESS_SHA256_FINGERPRINTS,
    shared,
  );

  const targets = [];
  if (buyer.length > 0) {
    targets.push({
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: buyerPackage,
        sha256_cert_fingerprints: buyer,
      },
    });
  }
  if (business.length > 0) {
    targets.push({
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: businessPackage,
        sha256_cert_fingerprints: business,
      },
    });
  }

  return NextResponse.json(targets, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
