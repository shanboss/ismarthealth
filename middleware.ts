import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this"
);

// Define protected routes and their allowed roles
const PROTECTED_ROUTES = {
  "/lab": [2, 6, 7, 8], // Laboratory, Billing, Samples, Lab_Reports
  "/physician": [1, 4], // Physician, Phy_Admin
  "/profile": [1, 2, 3, 4, 5, 6, 7, 8], // All authenticated users
} as const;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("[Middleware] Checking path:", pathname);

  // Check if the route needs protection
  const protectedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route)
  );

  if (!protectedRoute) {
    // Public route, allow access
    console.log("[Middleware] Public route, allowing");
    return NextResponse.next();
  }

  console.log("[Middleware] Protected route detected:", protectedRoute);

  // Get token from cookie
  const token = request.cookies.get("auth-token")?.value;

  console.log("[Middleware] Token found:", token ? "YES" : "NO");

  if (!token) {
    // No token, redirect to login
    console.log("[Middleware] No token, redirecting to login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify token using jose (works in Edge Runtime)
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const decoded = payload as {
      role_id: number;
      login_id: number;
    };

    console.log("[Middleware] Token valid, role_id:", decoded.role_id);

    // Check if user has the required role
    const allowedRoles =
      PROTECTED_ROUTES[protectedRoute as keyof typeof PROTECTED_ROUTES];

    console.log("[Middleware] Allowed roles:", allowedRoles);

    if (!allowedRoles.includes(decoded.role_id)) {
      // User doesn't have permission, redirect to appropriate page
      console.log("[Middleware] Role not allowed, redirecting to unauthorized");
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // User is authenticated and authorized
    console.log("[Middleware] Access granted!");
    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    console.error("[Middleware] Token verification failed:", error);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: ["/lab/:path*", "/physician/:path*", "/profile/:path*"],
};
