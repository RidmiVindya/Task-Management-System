import connectDB from "@/backend/config/database";
import Task, { ITask } from "@/backend/models/Task.model";
import { CreateTaskInput, UpdateTaskInput } from "@/backend/validators/task.validator";

/**
 * Task Service
 * Contains business logic for task operations
 */
export class TaskService {
  /**
   * Get all tasks sorted by creation date (newest first)
   */
  static async getAllTasks(): Promise<ITask[]> {
    await connectDB();
    return Task.find({}).sort({ createdAt: -1 });
  }

  /**
   * Get a single task by ID
   */
  static async getTaskById(id: string): Promise<ITask | null> {
    await connectDB();
    return Task.findById(id);
  }

  /**
   * Create a new task
   */
  static async createTask(data: CreateTaskInput): Promise<ITask> {
    await connectDB();
    return Task.create(data);
  }

  /**
   * Update an existing task
   */
  static async updateTask(id: string, data: UpdateTaskInput): Promise<ITask | null> {
    await connectDB();
    return Task.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete a task
   */
  static async deleteTask(id: string): Promise<ITask | null> {
    await connectDB();
    return Task.findByIdAndDelete(id);
  }
}
