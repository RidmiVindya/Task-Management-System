import { Task } from "@/types/task";
import { TaskTable } from "@/components/TaskTable";
import { TaskDialog } from "@/components/TaskDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { DashboardClient } from "./DashboardClient";
import connectDB from "@/lib/mongodb";
import TaskModel from "@/models/Task";

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
