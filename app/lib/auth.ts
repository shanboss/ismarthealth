import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export interface AuthUser {
  login_id: number;
  phone_num: string;
  role_id: number;
  role_name: string;
  laboratory_id?: number | null;
  physician_id?: number | null;
}

// Verify JWT token from cookies
export async function verifyAuth(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

// Verify token from request headers (for API routes)
export function verifyAuthFromRequest(request: NextRequest): AuthUser | null {
  try {
    // Try cookie first
    const tokenFromCookie = request.cookies.get("auth-token")?.value;
    
    // Try Authorization header as fallback
    const authHeader = request.headers.get("authorization");
    const tokenFromHeader = authHeader?.replace("Bearer ", "");
    
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

// Check if user has required role
export function hasRole(user: AuthUser | null, allowedRoles: number[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role_id);
}

// Role IDs for easy reference
export const ROLES = {
  PHYSICIAN: 1,
  LABORATORY: 2,
  PATIENT: 3,
  PHY_ADMIN: 4,
  SUPER_ADMIN: 5,
  BILLING: 6,
  SAMPLES: 7,
  LAB_REPORTS: 8,
} as const;

