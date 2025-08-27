import type { Task } from "@/types";
import api from "./api";

export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  const response = await api.post<Task>("/todos", taskData);
  return response.data;
};

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<{ items: Task[] }>("/todos");
  return response.data.items || [];
};

export const updateTask = async (
  taskId: string,
  taskData: Partial<Task>
): Promise<Task> => {
  const response = await api.put<Task>(`/todos/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/todos/${taskId}`);
};
