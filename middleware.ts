import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  url.hostname = "cashcalcs.com";
  url.port = "";
  url.pathname = "/debt-payoff" + url.pathname;
  if (url.pathname === "/debt-payoff/") url.pathname = "/debt-payoff";
  return NextResponse.redirect(url, 301);
}
