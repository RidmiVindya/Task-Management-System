import { NextRequest } from "next/server";
import { TaskController } from "@/backend/controllers/task.controller";

/**
 * GET /api/tasks/:id
 * Fetch a single task by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return TaskController.getTaskById(params.id);
}

/**
 * PUT /api/tasks/:id
 * Update a task by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return TaskController.updateTask(params.id, request);
}

/**
 * DELETE /api/tasks/:id
 * Delete a task by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return TaskController.deleteTask(params.id);
}
