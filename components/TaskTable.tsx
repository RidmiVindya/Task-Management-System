"use client";

import { Task } from "@/types/task";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityIndicator } from "@/components/PriorityIndicator";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Inbox } from "lucide-react";
import { format } from "date-fns";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string, title: string) => void;
  loading?: boolean;
}

export function TaskTable({
  tasks,
  onEdit,
  onDelete,
  loading = false,
}: TaskTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading tasks...</span>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="p-4 rounded-full bg-muted/50 mb-4">
          <Inbox className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No tasks yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Create your first task to start organizing your work
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-border/50">
            <TableHead className="w-[250px] font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="w-[130px] font-semibold">Status</TableHead>
            <TableHead className="w-[120px] font-semibold">Priority</TableHead>
            <TableHead className="w-[140px] font-semibold">Created</TableHead>
            <TableHead className="w-[100px] text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow 
              key={task._id}
              className="group transition-colors hover:bg-muted/50"
              style={{ 
                animationDelay: `${index * 50}ms`,
                animation: 'fadeIn 0.3s ease-out forwards'
              }}
            >
              <TableCell className="font-medium">
                <span className="line-clamp-1">{task.title}</span>
              </TableCell>
              <TableCell className="max-w-md">
                <span className="line-clamp-1 text-muted-foreground">
                  {task.description || "—"}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={task.status} />
              </TableCell>
              <TableCell>
                <PriorityIndicator priority={task.priority} showLabel />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(task.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(task)}
                    className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(task._id, task.title)}
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
