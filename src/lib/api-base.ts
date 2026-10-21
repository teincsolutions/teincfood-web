/**
 * Server-side resolution of the Teinc Food backend URL.
 *
 * `TEINCFOOD_API_BASE_URL` is deliberately **version-less** — e.g.
 * "https://food.teincsolutions.com/api" — and the API version is appended
 * separately from `TEINCFOOD_API_VERSION`. That keeps the URL valid when a
 * v2 API is introduced: point the base at the same host and flip the version,
 * without touching a single call site.
 */

/** Used when the deployment has no base configured (local dev). */
const DEFAULT_API_BASE = "http://localhost:4000/api";
const DEFAULT_API_VERSION = "v1";

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, "");
}

/** The configured base, without a trailing slash and without a version. */
export const API_BASE = trimSlashes(
  process.env.TEINCFOOD_API_BASE_URL || DEFAULT_API_BASE,
);

/** The API version segment, without slashes. */
export const API_VERSION = trimSlashes(
  process.env.TEINCFOOD_API_VERSION || DEFAULT_API_VERSION,
);

/**
 * Whether the deployment was given an explicit base. The proxy routes answer
 * 503 when it was not, rather than silently calling localhost.
 */
export const API_CONFIGURED = Boolean(
  process.env.TEINCFOOD_API_BASE_URL?.trim(),
);

/**
 * Builds a fully-qualified backend URL for an API path.
 *
 *   apiUrl("/pages/privacy") -> "<base>/v1/pages/privacy"
 *
 * The path may carry a query string; it is appended verbatim.
 */
export function apiUrl(path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  const version = API_VERSION ? `/${API_VERSION}` : "";
  return `${API_BASE}${version}${suffix}`;
}
