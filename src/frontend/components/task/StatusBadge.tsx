import { TaskStatus } from "@/shared/types/task.types";
import { cn } from "@/shared/lib/utils";
import { ListTodo, Clock, CheckCircle2 } from "lucide-react";

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

const statusConfig: Record<TaskStatus, { 
  label: string; 
  icon: typeof ListTodo;
  bgColor: string;
  textColor: string;
  iconColor: string;
}> = {
  todo: {
    label: "To Do",
    icon: ListTodo,
    bgColor: "bg-slate-100 dark:bg-slate-800",
    textColor: "text-slate-700 dark:text-slate-300",
    iconColor: "text-slate-500",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-300",
    iconColor: "text-blue-500",
  },
  done: {
    label: "Done",
    icon: CheckCircle2,
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-700 dark:text-green-300",
    iconColor: "text-green-500",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <Icon className={cn("h-3.5 w-3.5", config.iconColor)} />
      {config.label}
    </span>
  );
}
