// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;

    // Protect /dashboard/* for logged-in users only
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (!role) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Restrict manager-only routes
    if (
      req.nextUrl.pathname.startsWith("/api/staff") ||
      req.nextUrl.pathname.startsWith("/dashboard/staff")
    ) {
      if (role !== "MANAGER" && role !== "OWNER") {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized({ token }) {
        return !!token; // Allow only logged-in users
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",       // dashboard pages
    "/api/reservations/:path*",// protected API
    "/api/tables/:path*",      // protected API
    "/api/staff/:path*",       // manager-only API
  ],
};
