import type { Task } from "@/types";

export const getStatusBadgeStyleProps = (
  status: Task["status"]
): {
  variant: "default" | "secondary" | "destructive" | "outline" | null;
  className?: string;
} => {
  switch (status) {
    case "Todo":
      return {
        variant: "outline",
        className:
          "bg-yellow-100 text-yellow-800 border-yellow-400 hover:bg-yellow-200 dark:text-yellow-300 dark:border-yellow-600 dark:bg-yellow-700/30 dark:hover:bg-yellow-700/40 font-medium",
      };
    case "In Progress":
      return {
        variant: "default",
        className:
          "bg-sky-500 hover:bg-sky-500/90 text-sky-50 dark:bg-sky-600 dark:hover:bg-sky-600/90 dark:text-sky-50 border-sky-600 dark:border-sky-700 font-medium",
      };
    case "Done":
      return {
        variant: "default",
        className:
          "bg-emerald-500 hover:bg-emerald-500/90 text-emerald-50 dark:bg-emerald-600 dark:hover:bg-emerald-600/90 dark:text-emerald-50 border-emerald-600 dark:border-emerald-700 font-medium",
      };
    default:
      return { variant: "outline", className: "font-medium" };
  }
};
