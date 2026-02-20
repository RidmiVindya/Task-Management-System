import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "@/backend/services/task.service";
import { createTaskSchema, updateTaskSchema } from "@/backend/validators/task.validator";
import mongoose from "mongoose";

/**
 * Task Controller
 * Handles HTTP request/response logic for task operations
 */
export class TaskController {
  /**
   * Get all tasks
   */
  static async getAllTasks(): Promise<NextResponse> {
    try {
      const tasks = await TaskService.getAllTasks();

      return NextResponse.json(
        {
          success: true,
          data: tasks,
          count: tasks.length,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch tasks",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }

  /**
   * Get a single task by ID
   */
  static async getTaskById(id: string): Promise<NextResponse> {
    try {
      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid task ID format",
          },
          { status: 400 }
        );
      }

      const task = await TaskService.getTaskById(id);

      if (!task) {
        return NextResponse.json(
          {
            success: false,
            error: "Task not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: task,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching task:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch task",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }

  /**
   * Create a new task
   */
  static async createTask(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();

      // Validate input
      const validationResult = createTaskSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: validationResult.error.errors,
          },
          { status: 400 }
        );
      }

      const task = await TaskService.createTask(validationResult.data);

      return NextResponse.json(
        {
          success: true,
          data: task,
          message: "Task created successfully",
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating task:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create task",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }

  /**
   * Update an existing task
   */
  static async updateTask(id: string, request: NextRequest): Promise<NextResponse> {
    try {
      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid task ID format",
          },
          { status: 400 }
        );
      }

      const body = await request.json();

      // Validate input
      const validationResult = updateTaskSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: validationResult.error.errors,
          },
          { status: 400 }
        );
      }

      const task = await TaskService.updateTask(id, validationResult.data);

      if (!task) {
        return NextResponse.json(
          {
            success: false,
            error: "Task not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: task,
          message: "Task updated successfully",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating task:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update task",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }

  /**
   * Delete a task
   */
  static async deleteTask(id: string): Promise<NextResponse> {
    try {
      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid task ID format",
          },
          { status: 400 }
        );
      }

      const task = await TaskService.deleteTask(id);

      if (!task) {
        return NextResponse.json(
          {
            success: false,
            error: "Task not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Task deleted successfully",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting task:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete task",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }
}
