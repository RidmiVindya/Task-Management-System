# Task Management Application

A production-quality full-stack Task Management CRUD application built with Next.js 14, TypeScript, MongoDB Atlas, Mongoose, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, and Delete tasks
- **Modern UI**: Clean SaaS dashboard design with dark mode support
- **Type Safety**: Full TypeScript coverage throughout the application
- **Server Components**: Optimized data fetching with Next.js Server Components
- **Client Components**: Interactive UI elements with React hooks
- **Form Validation**: Client and server-side validation using Zod
- **Responsive Design**: Mobile-first responsive layout
- **Toast Notifications**: User feedback for all operations
- **Status Management**: Track task status (To Do, In Progress, Done)
- **Priority Levels**: Set task priority (Low, Medium, High)

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Validation**: Zod
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## 📁 Project Structure

```
taskmanagementapp/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts              # GET, POST endpoints
│   │       └── [id]/
│   │           └── route.ts         # GET, PUT, DELETE endpoints
│   ├── dashboard/
│   │   ├── page.tsx                 # Server Component (data fetching)
│   │   └── DashboardClient.tsx     # Client Component (interactivity)
│   ├── globals.css                  # Global styles with dark mode
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Home page (redirects to dashboard)
├── components/
│   ├── ui/                          # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── toast.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   └── alert-dialog.tsx
│   ├── StatusBadge.tsx              # Task status badge component
│   ├── PriorityIndicator.tsx        # Priority indicator component
│   ├── TaskTable.tsx                # Task table display component
│   ├── TaskDialog.tsx                # Create/Edit task dialog
│   └── DeleteConfirmDialog.tsx       # Delete confirmation dialog
├── hooks/
│   └── useTasks.ts                  # Custom hook for task management
├── lib/
│   ├── mongodb.ts                   # MongoDB connection singleton
│   ├── validation.ts                 # Zod validation schemas
│   └── utils.ts                     # Utility functions (cn)
├── models/
│   └── Task.ts                      # Mongoose Task model
├── types/
│   └── task.ts                      # TypeScript type definitions
├── .env.local.example               # Environment variables template
├── components.json                  # shadcn/ui configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                    # Dependencies and scripts
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- MongoDB Atlas account (free tier works)

### Step 1: Clone and Install Dependencies

```bash
# Navigate to project directory
cd taskmanagementapp

# Install dependencies
npm install
```

### Step 2: Set Up MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier M0 works fine)
3. Create a database user:
   - Go to Database Access → Add New Database User
   - Choose Password authentication
   - Save the username and password
4. Whitelist your IP address:
   - Go to Network Access → Add IP Address
   - Click "Allow Access from Anywhere" for development (or add your specific IP)
5. Get your connection string:
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`)

### Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement?retryWrites=true&w=majority
   ```
   
   Replace:
   - `username` with your MongoDB username
   - `password` with your MongoDB password
   - `cluster` with your cluster name
   - `taskmanagement` with your preferred database name

### Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically redirect to `/dashboard`.

## 🏗️ Architecture Overview

### Backend Architecture

#### MongoDB Connection (`lib/mongodb.ts`)

The MongoDB connection uses a singleton pattern to prevent multiple connections during development hot-reloads:

```typescript
// Connection is cached globally
let cached = global.mongoose;

// Reuses existing connection if available
if (cached.conn) {
  return cached.conn;
}
```

**Why this pattern?**
- Next.js API routes can be called multiple times during development
- Each API route call would create a new connection without caching
- The singleton pattern ensures we reuse the same connection
- Prevents connection pool exhaustion

#### Task Model (`models/Task.ts`)

The Mongoose schema defines:
- **title**: Required string, max 200 characters
- **description**: Optional string, max 1000 characters
- **status**: Enum ("todo", "in-progress", "done"), defaults to "todo"
- **priority**: Enum ("low", "medium", "high"), defaults to "medium"
- **timestamps**: Automatically managed `createdAt` and `updatedAt`

#### API Routes (`app/api/tasks/`)

**GET /api/tasks**
- Fetches all tasks sorted by creation date (newest first)
- Returns JSON with `success`, `data`, and `count`

**POST /api/tasks**
- Creates a new task
- Validates input using Zod schema
- Returns created task with 201 status

**GET /api/tasks/[id]**
- Fetches a single task by ID
- Validates MongoDB ObjectId format
- Returns 404 if task not found

**PUT /api/tasks/[id]**
- Updates an existing task
- Validates input and ObjectId
- Returns updated task

**DELETE /api/tasks/[id]**
- Deletes a task by ID
- Validates ObjectId
- Returns success message

**Error Handling Pattern:**
All routes follow a consistent error handling pattern:
```typescript
try {
  // Operation
  return NextResponse.json({ success: true, data }, { status: 200 });
} catch (error) {
  return NextResponse.json(
    { success: false, error: "Message", details },
    { status: 500 }
  );
}
```

### Frontend Architecture

#### Server Components vs Client Components

**Server Components** (`app/dashboard/page.tsx`):
- Fetch initial data on the server
- No JavaScript sent to client (smaller bundle)
- Direct database access
- Better SEO and performance

**Client Components** (`app/dashboard/DashboardClient.tsx`):
- Handle user interactions
- Manage local state
- Use React hooks
- Must be marked with `"use client"` directive

#### Component Structure

**TaskTable** (`components/TaskTable.tsx`):
- Server Component (can receive server-fetched data)
- Displays tasks in a table format
- Shows loading and empty states
- Calls callbacks for edit/delete actions

**TaskDialog** (`components/TaskDialog.tsx`):
- Client Component (form interactions)
- Handles both create and edit modes
- Form validation
- Controlled inputs with React state

**useTasks Hook** (`hooks/useTasks.ts`):
- Centralized task management logic
- Handles API calls
- Manages loading and error states
- Provides toast notifications
- Optimistic UI updates

### Data Flow

```
User Action (Click Create Task)
    ↓
DashboardClient (Client Component)
    ↓
useTasks Hook
    ↓
API Call (POST /api/tasks)
    ↓
API Route Handler
    ↓
Mongoose Model
    ↓
MongoDB Atlas
    ↓
Response flows back up
    ↓
State Update
    ↓
UI Re-render
```

## 🔧 How to Extend the Project

### Adding a New Field to Tasks

1. **Update the Mongoose Model** (`models/Task.ts`):
   ```typescript
   newField: {
     type: String,
     required: false,
   }
   ```

2. **Update TypeScript Types** (`types/task.ts`):
   ```typescript
   export interface Task {
     // ... existing fields
     newField?: string;
   }
   ```

3. **Update Validation Schema** (`lib/validation.ts`):
   ```typescript
   newField: z.string().optional()
   ```

4. **Update UI Components**:
   - Add input field to `TaskDialog.tsx`
   - Display field in `TaskTable.tsx` if needed

### Adding a New API Endpoint

1. Create a new route file in `app/api/your-endpoint/route.ts`
2. Export async functions: `GET`, `POST`, `PUT`, `DELETE`
3. Use the same error handling pattern
4. Connect to MongoDB using `connectDB()` from `lib/mongodb.ts`

### Adding a New UI Component

1. Create component in `components/` directory
2. Use shadcn/ui components from `components/ui/`
3. Follow the existing component patterns
4. Add TypeScript types for props

### Adding Dark Mode Toggle

1. Install `next-themes`: `npm install next-themes`
2. Create a theme provider component
3. Add toggle button to dashboard
4. Update `app/layout.tsx` to include theme provider

## 🐛 Common Pitfalls and Debugging

### MongoDB Connection Issues

**Problem**: "MONGODB_URI is not defined"
- **Solution**: Ensure `.env.local` exists and contains `MONGODB_URI`
- **Check**: Restart dev server after adding environment variables

**Problem**: "MongooseError: Operation `tasks.find()` buffering timed out"
- **Solution**: Ensure MongoDB connection is established before queries
- **Check**: Verify `await connectDB()` is called in API routes

**Problem**: "MongoNetworkError: connection timeout"
- **Solution**: Check MongoDB Atlas Network Access settings
- **Check**: Verify IP address is whitelisted
- **Check**: Ensure connection string is correct

### TypeScript Errors

**Problem**: "Cannot find module '@/...'"
- **Solution**: Check `tsconfig.json` paths configuration
- **Check**: Ensure import uses `@/` prefix

**Problem**: "Property does not exist on type"
- **Solution**: Update TypeScript interfaces in `types/task.ts`
- **Check**: Ensure Mongoose model matches TypeScript types

### Build Errors

**Problem**: "Module not found"
- **Solution**: Run `npm install` to ensure all dependencies are installed
- **Check**: Verify package names in `package.json`

**Problem**: "Hydration errors"
- **Solution**: Ensure Server Components don't use browser APIs
- **Check**: Mark components using hooks/state as `"use client"`

### Runtime Errors

**Problem**: "Cannot read property of undefined"
- **Solution**: Add null checks before accessing properties
- **Check**: Use optional chaining (`task?.title`)

**Problem**: "Toast notifications not showing"
- **Solution**: Ensure `<Toaster />` is included in layout
- **Check**: Verify toast provider is set up correctly

## 📝 API Documentation

### GET /api/tasks

Fetch all tasks.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Example Task",
      "description": "Task description",
      "status": "todo",
      "priority": "medium",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### POST /api/tasks

Create a new task.

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Optional description",
  "status": "todo",
  "priority": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* task object */ },
  "message": "Task created successfully"
}
```

### GET /api/tasks/[id]

Fetch a single task by ID.

**Response:**
```json
{
  "success": true,
  "data": { /* task object */ }
}
```

### PUT /api/tasks/[id]

Update a task.

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": "in-progress"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated task object */ },
  "message": "Task updated successfully"
}
```

### DELETE /api/tasks/[id]

Delete a task.

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add `MONGODB_URI` environment variable in Vercel dashboard
4. Deploy

### Environment Variables for Production

Ensure these are set in your hosting platform:
- `MONGODB_URI`: Your MongoDB Atlas connection string

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js 14 and TypeScript
#   T a s k - M a n a g e m e n t - S y s t e m  
 