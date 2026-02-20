import { NextRequest } from "next/server";
import { TaskController } from "@/backend/controllers/task.controller";

/**
 * GET /api/tasks
 * Fetch all tasks
 */
export async function GET() {
  return TaskController.getAllTasks();
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function POST(request: NextRequest) {
  return TaskController.createTask(request);
}
