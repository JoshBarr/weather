import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ulid } from "ulidx";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (!request.cookies.get("sessionId")) {
    const sessionCookie = {
      name: "sessionId",
      value: ulid(),
      path: "/",
    };

    request.cookies.set(sessionCookie);
    response.cookies.set(sessionCookie);
  }

  return response;
}

export const config = {
  matcher: "/",
};
