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

**Description:** Retrieves all tasks sorted by creation date (newest first).

**Request:** No request body required.

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "title": "Complete project documentation",
      "description": "Write comprehensive API docs",
      "status": "in-progress",
      "priority": "high",
      "createdAt": "2026-02-20T10:30:00.000Z",
      "updatedAt": "2026-02-20T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Failed to fetch tasks",
  "message": "Database connection error"
}
```

**Status Codes:**
- `200 OK` - Tasks retrieved successfully
- `500 Internal Server Error` - Server or database error

**Example:**
```javascript
const response = await fetch('/api/tasks');
const result = await response.json();

if (result.success) {
  console.log(`Found ${result.count} tasks`);
  result.data.forEach(task => console.log(task.title));
}
```

---

### 2. Get Task by ID

**Endpoint:** `GET /api/tasks/:id`

**Description:** Retrieves a single task by its MongoDB ObjectId.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | MongoDB ObjectId (24 hex characters) |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "title": "Complete project documentation",
    "description": "Write comprehensive API docs",
    "status": "in-progress",
    "priority": "high",
    "createdAt": "2026-02-20T10:30:00.000Z",
    "updatedAt": "2026-02-20T10:30:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request** - Invalid ID format:
```json
{
  "success": false,
  "error": "Invalid task ID format"
}
```

**404 Not Found** - Task doesn't exist:
```json
{
  "success": false,
  "error": "Task not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to fetch task",
  "message": "Database error"
}
```

**Status Codes:**
- `200 OK` - Task retrieved successfully
- `400 Bad Request` - Invalid ObjectId format
- `404 Not Found` - Task not found
- `500 Internal Server Error` - Server error

**Example:**
```javascript
const taskId = "65f1a2b3c4d5e6f7a8b9c0d1";
const response = await fetch(`/api/tasks/${taskId}`);
const result = await response.json();

if (result.success) {
  console.log(result.data.title);
} else {
  console.error(result.error);
}
```

---

### 3. Create Task

**Endpoint:** `POST /api/tasks`

**Description:** Creates a new task with validation.

**Request Body:**
```json
{
  "title": "New task title",
  "description": "Optional task description",
  "status": "todo",
  "priority": "medium"
}
```

**Field Validation:**

| Field | Type | Required | Constraints | Default |
|-------|------|----------|-------------|---------|
| title | string | Yes | 1-200 characters, trimmed | - |
| description | string | No | Max 1000 characters, trimmed | - |
| status | enum | No | "todo", "in-progress", "done" | "todo" |
| priority | enum | No | "low", "medium", "high" | "medium" |

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "title": "New task title",
    "description": "Optional task description",
    "status": "todo",
    "priority": "medium",
    "createdAt": "2026-02-20T10:30:00.000Z",
    "updatedAt": "2026-02-20T10:30:00.000Z"
  },
  "message": "Task created successfully"
}
```

**Error Responses:**

**400 Bad Request** - Validation failed:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "message": "Title is required",
      "path": ["title"]
    }
  ]
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to create task",
  "message": "Database error"
}
```

**Status Codes:**
- `201 Created` - Task created successfully
- `400 Bad Request` - Validation error (missing/invalid fields)
- `500 Internal Server Error` - Server or database error

**Example:**
```javascript
const response = await fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Complete API documentation',
    description: 'Write comprehensive docs for all endpoints',
    status: 'in-progress',
    priority: 'high'
  })
});

const result = await response.json();

if (result.success) {
  console.log('Task created:', result.data._id);
} else {
  console.error('Validation errors:', result.details);
}
```

---

### 4. Update Task

**Endpoint:** `PUT /api/tasks/:id`

**Description:** Updates an existing task. All fields are optional.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | MongoDB ObjectId |

**Request Body:**
```json
{
  "title": "Updated title",
  "status": "done",
  "priority": "low"
}
```

**Field Validation:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | No | 1-200 characters if provided, trimmed |
| description | string | No | Max 1000 characters if provided, trimmed |
| status | enum | No | "todo", "in-progress", "done" |
| priority | enum | No | "low", "medium", "high" |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "title": "Updated title",
    "description": "Original description",
    "status": "done",
    "priority": "low",
    "createdAt": "2026-02-20T10:30:00.000Z",
    "updatedAt": "2026-02-20T11:00:00.000Z"
  },
  "message": "Task updated successfully"
}
```

**Error Responses:**

**400 Bad Request** - Invalid ID or validation error:
```json
{
  "success": false,
  "error": "Invalid task ID format"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Task not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to update task",
  "message": "Database error"
}
```

**Status Codes:**
- `200 OK` - Task updated successfully
- `400 Bad Request` - Invalid ID format or validation error
- `404 Not Found` - Task not found
- `500 Internal Server Error` - Server error

**Example:**
```javascript
const taskId = "65f1a2b3c4d5e6f7a8b9c0d1";
const response = await fetch(`/api/tasks/${taskId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'done',
    priority: 'low'
  })
});

const result = await response.json();

if (result.success) {
  console.log('Task updated:', result.data);
} else {
  console.error(result.error);
}
```

---

### 5. Delete Task

**Endpoint:** `DELETE /api/tasks/:id`

**Description:** Permanently deletes a task by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | MongoDB ObjectId |

**Request:** No request body required.

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Responses:**

**400 Bad Request** - Invalid ID format:
```json
{
  "success": false,
  "error": "Invalid task ID format"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Task not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to delete task",
  "message": "Database error"
}
```

**Status Codes:**
- `200 OK` - Task deleted successfully
- `400 Bad Request` - Invalid ObjectId format
- `404 Not Found` - Task not found
- `500 Internal Server Error` - Server error

**Example:**
```javascript
const taskId = "65f1a2b3c4d5e6f7a8b9c0d1";
const response = await fetch(`/api/tasks/${taskId}`, {
  method: 'DELETE'
});

const result = await response.json();

if (result.success) {
  console.log(result.message);
} else {
  console.error(result.error);
}
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
