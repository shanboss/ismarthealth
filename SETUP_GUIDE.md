# iSmartHealth - Prisma Setup Guide

## Overview
This guide walks you through setting up Prisma with MySQL for user registration and authentication in your Next.js application.

## Prerequisites
- MySQL server running locally
- Node.js and Yarn installed
- Database created in MySQL
- **Note**: This project uses Prisma 5.22.0 for better compatibility with direct MySQL connections

## Setup Steps

### 1. Environment Configuration

Create or update your `.env` file in the root directory with your MySQL connection string:

```env
# MySQL Connection String Format:
# DATABASE_URL="mysql://username:password@localhost:3306/database_name"

DATABASE_URL="mysql://root:your_password@localhost:3306/ismarthealth"

# Alternative: Individual MySQL variables (for mysql2 direct connection)
MYSQL_HOST="localhost"
MYSQL_PORT="3306"
MYSQL_USER="root"
MYSQL_PASSWORD="your_password"
MYSQL_DATABASE="ismarthealth"
```

### 2. Generate Prisma Client

After setting up your `.env` file, generate the Prisma Client:

```bash
npx prisma generate
```

This will create the Prisma Client in `app/generated/prisma/`.

### 3. Database Schema

Your Prisma schema is already set up in `prisma/schema.prisma`. The key models for authentication are:

- **`user`** - Stores role definitions (Physician, Laboratory, Patient, etc.)
- **`login_details`** - Stores user authentication information

### 4. Available API Endpoints

#### Register a New User
```
POST /api/auth/register
Content-Type: application/json

{
  "firstname": "John Doe",
  "username": "johndoe",
  "password": "SecurePassword123!",
  "phone_num": "1234567890",
  "role_id": 3,
  "state": 1,
  "city": 1,
  "device_id": "optional-device-id",
  "player_id": "optional-player-id"
}
```

**Role IDs:**
- 1 = Physician
- 2 = Laboratory
- 3 = Patient
- 4 = Phy_Admin
- 5 = Super_Admin
- 6 = Billing
- 7 = Samples
- 8 = Lab_Reports

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "login_id": 1,
    "firstname": "John Doe",
    "username": "johndoe",
    "phone_num": "1234567890",
    "role_id": 3,
    "created_on": "2024-12-22T10:30:00.000Z"
  }
}
```

**Response (Error - 409):**
```json
{
  "error": "User with this phone number already exists"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "phone_num": "1234567890",
  "password": "SecurePassword123!"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "login_id": 1,
    "firstname": "John Doe",
    "username": "johndoe",
    "phone_num": "1234567890",
    "role_id": 3,
    "role_name": "Patient",
    "physician_id": null,
    "laboratory_id": null,
    "patient_id": null,
    "phy_admin_id": null,
    "state": 1,
    "city": 1,
    "last_login": "2024-12-22T10:35:00.000Z"
  }
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid credentials"
}
```

### 5. Testing the API

#### Using curl:

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John Doe",
    "username": "johndoe",
    "password": "SecurePassword123!",
    "phone_num": "1234567890",
    "role_id": 3,
    "state": 1,
    "city": 1
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone_num": "1234567890",
    "password": "SecurePassword123!"
  }'
```

#### Using the REST Client (VS Code Extension):

Open `test-api.http` and click "Send Request" above each request.

### 6. Security Features

✅ **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
✅ **Duplicate Prevention**: Checks for existing phone numbers and usernames
✅ **Role Validation**: Ensures valid role_id (1-8)
✅ **Active Status Check**: Login verifies user account is active
✅ **Login Tracking**: Updates last_login timestamp and login count

### 7. Database Connection

The app uses two connection methods:

1. **Prisma Client** (`app/lib/prisma.ts`) - For ORM operations
2. **mysql2 Pool** (`app/lib/mysql.ts`) - For raw SQL queries (legacy)

You can use either method, but Prisma is recommended for new features.

### 8. Next Steps

- [ ] Add JWT token generation for session management
- [ ] Implement password reset functionality
- [ ] Add email verification
- [ ] Create middleware for protected routes
- [ ] Add rate limiting for login attempts
- [ ] Implement refresh tokens

### 9. Troubleshooting

**Issue: "PrismaClient is unable to connect to the database"**
- Check your DATABASE_URL in `.env`
- Ensure MySQL server is running
- Verify database credentials

**Issue: "Table 'login_details' doesn't exist"**
- Run: `npx prisma db push` to sync schema with database
- Or ensure your database already has the tables

**Issue: "Cannot find module '@/app/generated/prisma'"**
- Run: `npx prisma generate` to generate the Prisma Client

## File Structure

```
app/
├── api/
│   └── auth/
│       ├── register/
│       │   └── route.ts       # User registration endpoint
│       └── login/
│           └── route.ts       # User login endpoint
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   └── mysql.ts              # MySQL2 connection (legacy)
└── generated/
    └── prisma/               # Generated Prisma Client

prisma/
└── schema.prisma             # Database schema definition

test-api.http                 # API testing file
```

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)

