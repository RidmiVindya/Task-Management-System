"use client";

import { useState, useEffect } from "react";
import { Task, CreateTaskInput, UpdateTaskInput } from "@/types/task";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus, TaskPriority } from "@/types/task";
import { 
  ListTodo, 
  Clock, 
  CheckCircle2,
  ArrowDown,
  Minus,
  ArrowUp,
  Sparkles,
  Pencil
} from "lucide-react";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSubmit: (input: CreateTaskInput | UpdateTaskInput) => Promise<void>;
  loading?: boolean;
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  onSubmit,
  loading = false,
}: TaskDialogProps) {
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
      });
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    if (!loading) {
      onOpenChange(false);
    }
  };

  const isEditing = !!task;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0">
        <form onSubmit={handleSubmit}>
          {/* Header with gradient */}
          <DialogHeader className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isEditing ? 'bg-amber-500/10' : 'bg-primary/10'}`}>
                {isEditing ? (
                  <Pencil className="h-5 w-5 text-amber-500" />
                ) : (
                  <Sparkles className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {isEditing ? "Edit Task" : "Create New Task"}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {isEditing
                    ? "Make changes to your task below"
                    : "Add a new task to your list"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Form body */}
          <div className="p-6 space-y-5">
            {/* Title field */}
            <div className="space-y-2 form-field-enter animate-stagger-1">
              <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                Title
                <span className="text-xs text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="What needs to be done?"
                required
                disabled={loading}
                className="h-11 text-base input-focus-ring form-transition"
              />
            </div>

            {/* Description field */}
            <div className="space-y-2 form-field-enter animate-stagger-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Add more details about this task..."
                rows={3}
                disabled={loading}
                className="resize-none input-focus-ring form-transition text-base"
              />
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-2 form-field-enter animate-stagger-3">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: TaskStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="status" className="h-11 form-transition">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">
                      <div className="flex items-center gap-2">
                        <ListTodo className="h-4 w-4 text-slate-500" />
                        <span>To Do</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="in-progress">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>In Progress</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="done">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Done</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2 form-field-enter animate-stagger-4">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: TaskPriority) =>
                    setFormData({ ...formData, priority: value })
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="priority" className="h-11 form-transition">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="h-4 w-4 text-green-500" />
                        <span>Low</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <Minus className="h-4 w-4 text-yellow-500" />
                        <span>Medium</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="h-4 w-4 text-red-500" />
                        <span>High</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="border-t border-border/50">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="min-w-[100px] form-transition"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.title.trim()}
              className={`min-w-[120px] btn-hover-lift form-transition ${
                isEditing 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : isEditing ? (
                <span className="flex items-center gap-2">
                  <Pencil className="h-4 w-4" />
                  Update Task
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Create Task
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
