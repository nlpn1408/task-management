export type TaskStatus = "Todo" | "In Progress" | "Done";

export const TASK_STATUSES: TaskStatus[] = [
  "Todo",
  "In Progress",
  "Done",
];

export interface Task {
  id: string;
  taskCode: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DraggableItemData {
  type: string;
  task?: Task;
  status?: TaskStatus;
}

export type TaskId = string;
export type ColumnId = TaskStatus | string;
