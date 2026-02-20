/**
 * Backend Module Exports
 * Central export point for all backend modules
 */

// Config
export { default as connectDB } from "./config/database";

// Models
export { default as Task } from "./models/Task.model";
export type { ITask, TaskStatus, TaskPriority } from "./models/Task.model";

// Controllers
export { TaskController } from "./controllers/task.controller";

// Services
export { TaskService } from "./services/task.service";

// Validators
export { createTaskSchema, updateTaskSchema } from "./validators/task.validator";
export type { CreateTaskInput, UpdateTaskInput } from "./validators/task.validator";
