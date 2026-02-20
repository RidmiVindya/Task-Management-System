# Task Management API Documentation

## Base URL

```
http://localhost:3000/api
```

## Response Format

All responses follow a consistent structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "count": 0
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "details": [ ... ]
}
```

---

## Endpoints

### 1. Get All Tasks

**Endpoint:** `GET /api/tasks`

**Response:** `200 OK` - Returns array of tasks sorted by creation date (newest first)  
**Errors:** `500` (server/database error)

**Example:**
```javascript
const response = await fetch('/api/tasks');
const result = await response.json();
// result.data = array of tasks, result.count = number of tasks
```

---

### 2. Get Task by ID

**Endpoint:** `GET /api/tasks/:id`

**Path Parameters:** `id` (string, required) - MongoDB ObjectId

**Response:** `200 OK` - Returns task object  
**Errors:** `400` (invalid ID format), `404` (not found), `500` (server error)

**Example:**
```javascript
const response = await fetch(`/api/tasks/${taskId}`);
const result = await response.json();
```

---

### 3. Create Task

**Endpoint:** `POST /api/tasks`

**Request Body:**
```json
{
  "title": "New task title",           // Required, 1-200 chars
  "description": "Optional",           // Optional, max 1000 chars
  "status": "todo",                    // Optional: "todo" | "in-progress" | "done" (default: "todo")
  "priority": "medium"                 // Optional: "low" | "medium" | "high" (default: "medium")
}
```

**Response:** `201 Created` - Returns created task object  
**Errors:** `400` (validation failed), `500` (server error)

**Example:**
```javascript
const response = await fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'New task', status: 'todo', priority: 'high' })
});
const result = await response.json();
```

---

### 4. Update Task

**Endpoint:** `PUT /api/tasks/:id`

**Request Body:** All fields optional (same validation as Create)
```json
{
  "title": "Updated title",      // Optional, 1-200 chars if provided
  "description": "Updated",      // Optional, max 1000 chars
  "status": "done",              // Optional: "todo" | "in-progress" | "done"
  "priority": "low"              // Optional: "low" | "medium" | "high"
}
```

**Response:** `200 OK` - Returns updated task object  
**Errors:** `400` (invalid ID/validation), `404` (not found), `500` (server error)

**Example:**
```javascript
const response = await fetch(`/api/tasks/${taskId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'done', priority: 'low' })
});
const result = await response.json();
```

---

### 5. Delete Task

**Endpoint:** `DELETE /api/tasks/:id`

**Path Parameters:** `id` (string, required) - MongoDB ObjectId

**Response:** `200 OK` - Returns success message  
**Errors:** `400` (invalid ID format), `404` (not found), `500` (server error)

**Example:**
```javascript
const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
const result = await response.json();
```

---

## Security Considerations

### Current Implementation
- **No Authentication:** The current API does not implement authentication or authorization. All endpoints are publicly accessible.
- **Input Validation:** All user inputs are validated using Zod schemas to prevent injection attacks and invalid data.
- **MongoDB Injection Protection:** Mongoose ODM provides built-in protection against NoSQL injection attacks.

### Recommended Enhancements
- **JWT Authentication:** Implement JWT tokens for user authentication
- **HTTP-only Cookies:** Store tokens in HTTP-only cookies to prevent XSS attacks
- **Rate Limiting:** Implement rate limiting to prevent abuse
- **CORS Configuration:** Configure CORS to restrict allowed origins
- **Input Sanitization:** Additional sanitization for user-generated content

---

## Data Models

### Task Object

```typescript
interface Task {
  _id: string;                    // MongoDB ObjectId (24 hex characters)
  title: string;                   // Required, 1-200 characters
  description?: string;            // Optional, max 1000 characters
  status: "todo" | "in-progress" | "done";  // Default: "todo"
  priority: "low" | "medium" | "high";      // Default: "medium"
  createdAt: string;              // ISO 8601 timestamp
  updatedAt: string;              // ISO 8601 timestamp
}
```

---

## Error Handling

All endpoints return consistent error responses. Always check the `success` field before accessing `data`:

```javascript
const response = await fetch('/api/tasks');
const result = await response.json();

if (!result.success) {
  // Handle error
  console.error(result.error);
  if (result.details) {
    // Validation errors
    result.details.forEach(err => console.error(err.message));
  }
  return;
}

// Use data
console.log(result.data);
```

---

## Rate Limits

Currently, no rate limits are enforced. For production, consider implementing:
- 100 requests per minute per IP
- 1000 requests per hour per IP

---

## Support

For issues or questions, please refer to the project repository or contact the development team.
