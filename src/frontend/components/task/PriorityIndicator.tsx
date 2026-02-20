import { TaskPriority } from "@/shared/types/task.types";
import { cn } from "@/shared/lib/utils";
import { ArrowDown, Minus, ArrowUp } from "lucide-react";

interface PriorityIndicatorProps {
  priority: TaskPriority;
  className?: string;
  showLabel?: boolean;
}

const priorityConfig: Record<
  TaskPriority,
  {
    label: string;
    icon: typeof ArrowDown;
    iconColor: string;
    bgColor: string;
    textColor: string;
  }
> = {
  low: {
    label: "Low",
    icon: ArrowDown,
    iconColor: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-700 dark:text-green-300",
  },
  medium: {
    label: "Medium",
    icon: Minus,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-700 dark:text-yellow-300",
  },
  high: {
    label: "High",
    icon: ArrowUp,
    iconColor: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-700 dark:text-red-300",
  },
};

export function PriorityIndicator({
  priority,
  className,
  showLabel = false,
}: PriorityIndicatorProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  if (!showLabel) {
    return (
      <div className={cn("flex items-center", className)}>
        <Icon className={cn("h-4 w-4", config.iconColor)} />
      </div>
    );
  }

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
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
