import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  //  Allow admin login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  //  Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
