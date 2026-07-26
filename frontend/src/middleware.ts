import { NextResponse, type NextRequest } from "next/server";

// Arabic-only platform — no locale routing needed.
// This middleware is a pass-through.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
