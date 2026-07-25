/**
 * Arabic-only routing shim.
 * Replaces next-intl navigation exports with standard Next.js equivalents.
 * All locale routing has been removed — the platform is now Arabic-only.
 */
export { default as Link } from "next/link";
export { useRouter, usePathname, useSearchParams, redirect } from "next/navigation";

// Stub — not used but kept for any residual imports
export function getPathname() { return ""; }
