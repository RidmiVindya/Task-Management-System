"use client";

import { useState } from "react";
import { Task, CreateTaskInput, UpdateTaskInput } from "@/shared/types/task.types";
import { TaskTable, TaskDialog, DeleteConfirmDialog } from "@/frontend/components/task";
import { Button } from "@/frontend/components/ui/button";
import { Toaster } from "@/frontend/components/ui/toaster";
import { Plus, ListChecks } from "lucide-react";
import { useTasks } from "@/frontend/hooks/useTasks";

interface DashboardClientProps {
  initialTasks: Task[];
}

export function DashboardClient({ initialTasks }: DashboardClientProps) {
  const {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks(initialTasks);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleCreateTask = async (input: CreateTaskInput) => {
    await createTask(input);
  };

  const handleUpdateTask = async (input: UpdateTaskInput) => {
    if (selectedTask) {
      await updateTask(selectedTask._id, input);
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string, title: string) => {
    setTaskToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Clear selected task when dialog closes
      setTimeout(() => setSelectedTask(null), 200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Toaster />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <ListChecks className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
                <p className="text-muted-foreground mt-1">
                  {tasks.length === 0 
                    ? "Get started by creating your first task"
                    : `You have ${tasks.length} task${tasks.length === 1 ? '' : 's'}`
                  }
                </p>
              </div>
            </div>
            <Button 
              onClick={() => {
                setSelectedTask(null);
                setDialogOpen(true);
              }} 
              className="w-full sm:w-auto btn-hover-lift gap-2 h-11 px-6"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              New Task
            </Button>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <TaskTable
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            loading={loading}
          />
        </div>

        {/* Dialogs */}
        <TaskDialog
          open={dialogOpen}
          onOpenChange={handleDialogOpenChange}
          task={selectedTask}
          onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
          loading={loading}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          taskTitle={taskToDelete?.title}
          loading={loading}
        />
      </div>
    </div>
  );
}
