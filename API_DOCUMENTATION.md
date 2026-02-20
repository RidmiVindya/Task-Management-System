# Authentication API Documentation

## Base URL

```
http://localhost:3000/api/auth
```

---

## Endpoints

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Purpose:** Create a new user account with email and password.

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Field Validation:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| username | string | Yes | 3-30 characters, alphanumeric + underscore |
| email | string | Yes | Valid email format |
| password | string | Yes | Min 8 characters, must contain uppercase, lowercase, number |

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2026-02-20T10:30:00.000Z"
    }
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

**HTTP Status Codes:**

- `201 Created` - User registered successfully
- `400 Bad Request` - Validation error or duplicate email
- `500 Internal Server Error` - Server error

**Security Considerations:**

- Passwords are hashed using bcrypt (12 rounds) before storage
- Password field is never returned in responses
- Email uniqueness is enforced at database level

**Usage Example:**

```javascript
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'johndoe',
    email: 'john@example.com',
    password: 'SecurePass123!'
  })
});

const data = await response.json();
if (response.ok) {
  console.log('User registered:', data.data.user);
} else {
  console.error('Registration failed:', data.error);
}
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Purpose:** Authenticate user and issue JWT token stored in HTTP-only cookie.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Field Validation:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| email | string | Yes | Valid email format |
| password | string | Yes | Non-empty string |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**HTTP Status Codes:**

- `200 OK` - Login successful, JWT cookie set
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Validation error
- `500 Internal Server Error` - Server error

**Security Considerations:**

- JWT token is stored in HTTP-only cookie (not accessible via JavaScript)
- Cookie is set with `Secure` flag (HTTPS only in production)
- Cookie has `SameSite=Strict` to prevent CSRF attacks
- Generic error message prevents user enumeration
- Password comparison uses constant-time bcrypt comparison

**Usage Example:**

```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Required for cookies
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass123!'
  })
});

const data = await response.json();
if (response.ok) {
  console.log('Login successful:', data.data.user);
  // JWT cookie is automatically set by server
} else {
  console.error('Login failed:', data.error);
}
```

---

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

**Purpose:** Retrieve authenticated user's profile information.

**Request Headers:**

```
Cookie: token=<jwt_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2026-02-20T10:30:00.000Z"
    }
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

**HTTP Status Codes:**

- `200 OK` - User data retrieved successfully
- `401 Unauthorized` - Missing, invalid, or expired token
- `500 Internal Server Error` - Server error

**Security Considerations:**

- Requires valid JWT token in HTTP-only cookie
- Token is verified using secret key
- Token expiration is checked (default: 7 days)
- User existence is verified in database

**Usage Example:**

```javascript
const response = await fetch('http://localhost:3000/api/auth/me', {
  method: 'GET',
  credentials: 'include', // Sends cookies automatically
  headers: {
    'Content-Type': 'application/json',
  }
});

const data = await response.json();
if (response.ok) {
  console.log('Current user:', data.data.user);
} else {
  console.error('Authentication failed:', data.error);
}
```

---

### 4. Logout User

**Endpoint:** `POST /api/auth/logout`

**Purpose:** Clear JWT token cookie and invalidate session.

**Request Headers:**

```
Cookie: token=<jwt_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**HTTP Status Codes:**

- `200 OK` - Logout successful, cookie cleared
- `500 Internal Server Error` - Server error

**Security Considerations:**

- Clears HTTP-only cookie by setting expiration to past date
- No token validation required (idempotent operation)

**Usage Example:**

```javascript
const response = await fetch('http://localhost:3000/api/auth/logout', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  }
});

const data = await response.json();
if (response.ok) {
  console.log('Logged out successfully');
  // Cookie is automatically cleared by server
}
```

---

## Authentication Flow

### Registration Flow

1. Client sends registration request with username, email, and password
2. Server validates input and checks for duplicate email
3. Password is hashed using bcrypt
4. User document is created in MongoDB
5. Success response returned (no token issued)

### Login Flow

1. Client sends login request with email and password
2. Server validates credentials against database
3. Password is verified using bcrypt comparison
4. JWT token is generated with user ID payload
5. Token is set in HTTP-only cookie
6. User data returned in response

### Protected Route Access

1. Client makes request to protected endpoint
2. Server middleware extracts JWT from cookie
3. Token is verified and decoded
4. User ID is extracted and user is fetched from database
5. Request proceeds with authenticated user context

### Logout Flow

1. Client sends logout request
2. Server clears JWT cookie
3. Success response returned

---

## JWT Token Structure

**Payload:**

```json
{
  "userId": "65f1a2b3c4d5e6f7a8b9c0d1",
  "iat": 1708425000,
  "exp": 1709029800
}
```

**Claims:**

- `userId`: MongoDB ObjectId of authenticated user
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (7 days from issue)

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message",
  "details": [] // Optional: field-level validation errors
}
```

**Common Error Codes:**

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required/invalid)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (server-side issues)

---

## Security Best Practices

1. **Password Security:**
   - Passwords are hashed with bcrypt (12 rounds)
   - Passwords never returned in API responses
   - Password validation enforces complexity requirements

2. **Token Security:**
   - JWT stored in HTTP-only cookies (XSS protection)
   - Secure flag enabled (HTTPS only in production)
   - SameSite=Strict (CSRF protection)
   - Token expiration enforced

3. **Input Validation:**
   - All inputs validated using Zod schemas
   - SQL injection prevented by Mongoose ODM
   - XSS protection via input sanitization

4. **Error Messages:**
   - Generic messages prevent user enumeration
   - Detailed errors logged server-side only

---

## Rate Limiting

Authentication endpoints are rate-limited to prevent brute force attacks:

- **Login:** 5 attempts per 15 minutes per IP
- **Register:** 3 attempts per hour per IP

Exceeding limits returns `429 Too Many Requests`.
