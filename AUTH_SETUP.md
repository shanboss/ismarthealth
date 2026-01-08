# 🔐 Authentication & Role-Based Access Control Setup

## Overview

Your application now has a complete authentication system with JWT tokens and role-based access control (RBAC).

## ✅ What's Been Implemented

### 1. **JWT Authentication**
- Login generates JWT tokens (valid for 7 days)
- Tokens stored in HTTP-only cookies (secure)
- Automatic token verification on protected routes

### 2. **Role-Based Access Control (RBAC)**
- Middleware automatically protects routes based on user roles
- Users are redirected to appropriate dashboards after login
- Unauthorized access attempts redirect to `/unauthorized`

### 3. **Protected Routes**

| Route | Allowed Roles |
|-------|---------------|
| `/lab/*` | Laboratory (2), Billing (6), Samples (7), Lab_Reports (8) |
| `/physician/*` | Physician (1), Phy_Admin (4) |
| `/profile/*` | All authenticated users |

### 4. **API Endpoints**

#### **Login** - `POST /api/auth/login`
```json
{
  "phone_num": "1234567890",
  "password": "LabPassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGci..."
}
```

#### **Logout** - `POST /api/auth/logout`
Clears the auth cookie.

#### **Register** - `POST /api/auth/register`
(Already implemented)

---

## 🚀 How to Use

### **Step 1: Set JWT Secret**

Add to your `.env` file:

```env
JWT_SECRET="your-super-secret-key-change-this-in-production"
```

**Important:** Use a strong, random secret in production!

### **Step 2: Login**

Navigate to: `http://localhost:3000/login`

**Test with your lab user:**
- Phone: `1234567890` (or whatever you used)
- Password: `LabPassword123!` (or whatever you used)

### **Step 3: Access Protected Routes**

After login, you'll be automatically redirected to:
- **Lab users** → `/lab`
- **Physician users** → `/physician?tab=dashboard`
- **Patients** → `/profile`

---

## 🔒 How It Works

### **Login Flow:**

1. **User submits credentials** → Login page sends to `/api/auth/login`
2. **Server validates** → Checks password with bcrypt
3. **JWT generated** → Token created with user info
4. **Cookie set** → HTTP-only cookie with token
5. **Redirect** → User sent to role-appropriate dashboard

### **Protected Route Access:**

1. **User visits `/lab`** → Middleware intercepts request
2. **Token checked** → Reads cookie, verifies JWT
3. **Role verified** → Checks if user's role can access `/lab`
4. **Access granted/denied** → Allow or redirect to login/unauthorized

---

## 📝 Role IDs Reference

```typescript
PHYSICIAN: 1
LABORATORY: 2
PATIENT: 3
PHY_ADMIN: 4
SUPER_ADMIN: 5
BILLING: 6
SAMPLES: 7
LAB_REPORTS: 8
```

---

## 🛠️ Files Created/Modified

### **New Files:**
- `app/lib/auth.ts` - Auth utility functions
- `middleware.ts` - Route protection middleware
- `app/unauthorized/page.tsx` - Unauthorized access page
- `app/api/auth/logout/route.ts` - Logout endpoint

### **Modified Files:**
- `app/api/auth/login/route.ts` - Added JWT generation
- `app/login/page.tsx` - Connected to real API

---

## 🧪 Testing

### **Test Lab Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "phone_num": "1234567890",
    "password": "LabPassword123!"
  }'
```

### **Test Protected Route:**

```bash
curl http://localhost:3000/lab \
  -b cookies.txt
```

---

## 🎯 Using Auth in Your Code

### **Server Components (Pages):**

```typescript
import { verifyAuth, ROLES, hasRole } from "@/app/lib/auth";

export default async function LabPage() {
  const user = await verifyAuth();
  
  if (!user) {
    redirect("/login");
  }
  
  if (!hasRole(user, [ROLES.LABORATORY, ROLES.BILLING])) {
    redirect("/unauthorized");
  }
  
  return <div>Welcome {user.role_name}</div>;
}
```

### **API Routes:**

```typescript
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  const user = verifyAuthFromRequest(request);
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (!hasRole(user, [ROLES.LABORATORY])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // Your protected logic here
}
```

### **Client Components:**

```typescript
"use client";

async function handleLogout() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/login";
}
```

---

## 🔐 Security Features

✅ **HTTP-only cookies** - Token not accessible via JavaScript (XSS protection)  
✅ **Secure flag** - Cookies only sent over HTTPS in production  
✅ **SameSite=lax** - CSRF protection  
✅ **7-day expiration** - Automatic token expiry  
✅ **Password hashing** - Bcrypt with 10 salt rounds  
✅ **Role verification** - Middleware checks on every request

---

## 🎨 Next Steps

- [ ] Add refresh tokens for long-lived sessions
- [ ] Implement "Remember me" functionality
- [ ] Add password reset flow
- [ ] Create user profile page
- [ ] Add audit logging for login attempts
- [ ] Implement 2FA (optional)
- [ ] Add session management dashboard

---

## 🐛 Troubleshooting

### **"Unauthorized" after login:**
- Check if JWT_SECRET is set in `.env`
- Verify cookies are being set (check browser DevTools → Application → Cookies)
- Make sure you're testing on `localhost:3000` (not a different port)

### **Middleware not working:**
- Restart your dev server after creating `middleware.ts`
- Check the `matcher` config in `middleware.ts`

### **Token expired:**
- Tokens expire after 7 days - just log in again

---

## 📚 Additional Resources

- [JWT.io](https://jwt.io) - Debug JWT tokens
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

---

**Your authentication system is now ready!** 🎉

Users can log in with their phone numbers and passwords, and the system automatically:
- Generates secure JWT tokens
- Stores them in HTTP-only cookies
- Protects routes based on user roles
- Redirects to appropriate dashboards

