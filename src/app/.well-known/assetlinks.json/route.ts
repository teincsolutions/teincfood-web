import { NextResponse } from "next/server";

/**
 * Android App Links association. Must be served from the link domain
 * (teincfood.com) so deep links open the matching native app:
 *   - Teinc Food          -> com.teincfood.app
 *   - Teinc Food Business -> com.teincfood.business
 *
 * SHA-256 fingerprints are public by design (also in the Play Console).
 * Use ANDROID_BUYER_SHA256_FINGERPRINTS and/or
 * ANDROID_BUSINESS_SHA256_FINGERPRINTS; ANDROID_SHA256_FINGERPRINTS is the
 * shared fallback when both apps use the same signing key.
 *
 * The defaults below are the Play Console / upload-key fingerprints. They are
 * merged with the environment values so a deployment that only knows the
 * upload key still serves the Play App Signing certificate required for
 * Android App Links verification. The business app has separate fingerprints
 * for the upload key and each Play signing key (internal/production).
 */
const DEFAULT_BUYER_FINGERPRINTS = [
  "0C:6F:9D:41:E6:FA:9D:53:41:1E:1B:A4:C6:1F:4A:67:04:9B:AE:42:28:1C:02:76:51:74:8E:24:37:11:10:E0",
];

const DEFAULT_BUSINESS_FINGERPRINTS = [
  "0C:6F:9D:41:E6:FA:9D:53:41:1E:1B:A4:C6:1F:4A:67:04:9B:AE:42:28:1C:02:76:51:74:8E:24:37:11:10:E0",
  "E5:B6:8D:C8:B4:BB:7C:24:FC:CC:0B:11:17:2C:A3:F9:02:A5:BF:5A:B3:23:BB:3E:CB:56:68:E3:0E:76:71:99",
  "F6:21:AC:70:BC:F6:13:FA:84:B2:FC:84:64:9A:38:80:4B:ED:AE:62:37:FC:08:63:D3:12:C5:89:78:CF:ED:56",
  "68:0E:EC:AB:49:7F:71:59:49:60:CE:99:9E:9E:E5:FD:3E:73:39:75:AD:73:5D:89:5D:85:DA:9D:C9:34:07:87",
];

function fingerprints(
  primary: string | undefined,
  fallback: string | undefined,
  defaults: string[],
) {
  const configured = (primary || fallback || "")
    .split(",")
    .map((fingerprint) => fingerprint.trim())
    .filter(Boolean);
  return [...new Set([...configured, ...defaults])];
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
    DEFAULT_BUYER_FINGERPRINTS,
  );
  const business = fingerprints(
    process.env.ANDROID_BUSINESS_SHA256_FINGERPRINTS,
    shared,
    DEFAULT_BUSINESS_FINGERPRINTS,
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
