# 🚀 Quick Start - Role-Based Authentication

## You're All Set! Here's What Works Now:

### ✅ **Login System with JWT**
- Secure token-based authentication
- HTTP-only cookies for security
- 7-day session expiry

### ✅ **Role-Based Access Control**
- Lab users can only access `/lab/*` routes
- Physician users can only access `/physician/*` routes
- Automatic redirects based on role

### ✅ **Protected Routes**
- Middleware automatically blocks unauthorized access
- Users redirected to login if not authenticated
- Users redirected to `/unauthorized` if wrong role

---

## 🎯 Try It Now!

### **1. Go to the login page:**
```
http://localhost:3000/login
```

### **2. Login with your lab account:**
- **Phone:** `1234567890`
- **Password:** `LabPassword123!`

### **3. You'll be automatically redirected to:**
```
http://localhost:3000/lab
```

### **4. Try accessing physician routes** (should be blocked):
```
http://localhost:3000/physician
→ Redirects to /unauthorized
```

---

## 🧪 Test Different Scenarios

### **Test 1: Lab User Access**
1. Login as lab user
2. Visit `/lab` ✅ Works
3. Visit `/physician` ❌ Blocked → `/unauthorized`

### **Test 2: Logout**
```typescript
// From browser console:
await fetch('/api/auth/logout', { method: 'POST' });
window.location.href = '/login';
```

### **Test 3: Direct Route Access (Not Logged In)**
1. Open incognito window
2. Visit `http://localhost:3000/lab`
3. Should redirect to `/login?redirect=/lab`

---

## 📋 Your Test Accounts

### **Lab User** (Created)
- Phone: `1234567890`
- Password: `LabPassword123!`
- Role: Laboratory (2)
- Access: `/lab/*` routes

### **Test User** (Created earlier)
- Phone: `9999999999`
- Password: `SecurePass123!`
- Role: Patient (3)
- Access: `/profile/*` routes

---

## 🔑 Create More Test Users

### **Physician User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Dr. Smith",
    "username": "drsmith",
    "password": "Doctor123!",
    "phone_num": "5555555555",
    "role_id": 1,
    "state": 1,
    "city": 1,
    "physician_id": 1
  }'
```

---

## 📁 Important Files

### **Middleware** (Auto-protects routes)
```
middleware.ts
```

### **Auth Utilities** (Helper functions)
```
app/lib/auth.ts
```

### **Login Page**
```
app/login/page.tsx
```

### **API Endpoints**
```
app/api/auth/login/route.ts
app/api/auth/logout/route.ts
app/api/auth/register/route.ts
```

---

## 🎨 How It Works

```
User visits /lab
       ↓
   Middleware checks
       ↓
   Has auth token? ──NO──→ Redirect to /login
       ↓ YES
   Role = Laboratory? ──NO──→ Redirect to /unauthorized
       ↓ YES
   Allow access ✅
```

---

## 🔐 Environment Variables

Make sure you have in `.env`:

```env
JWT_SECRET="your-secret-key-here"
DATABASE_URL="mysql://root:password@localhost:3306/ismarthhealth"
```

**Note:** Generate a secure JWT_SECRET for production!

---

## 🎉 What's Next?

Your authentication is working! Now you can:

1. **Test the login flow** with your lab user
2. **Access lab routes** securely
3. **Create physician users** and test their access
4. **Build protected features** knowing only authorized users can access them

---

## 💡 Quick Tips

### **Check if user is logged in (Server Component):**
```typescript
import { verifyAuth } from "@/app/lib/auth";

const user = await verifyAuth();
if (!user) redirect("/login");
```

### **Check user's role:**
```typescript
import { verifyAuth, ROLES, hasRole } from "@/app/lib/auth";

const user = await verifyAuth();
if (!hasRole(user, [ROLES.LABORATORY])) {
  redirect("/unauthorized");
}
```

### **Logout button:**
```typescript
async function handleLogout() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/login";
}
```

---

**Everything is ready to go! Go ahead and test your login!** 🚀

