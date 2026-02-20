import { Task } from "@/shared/types/task.types";
import { DashboardClient } from "./DashboardClient";
import connectDB from "@/backend/config/database";
import TaskModel from "@/backend/models/Task.model";

async function getTasks(): Promise<Task[]> {
  try {
    await connectDB();
    const tasks = await TaskModel.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(tasks));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const initialTasks = await getTasks();

  return <DashboardClient initialTasks={initialTasks} />;
}
