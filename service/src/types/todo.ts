export interface Todo {
  id: string;
  taskCode: string;
  title: string;
  description: string;
  status: "Todo" | "In Progress" | "Done";
  createdAt: string;
  updatedAt: string;
}

export interface ListTodosResponse {
  items: Todo[];
  count: number;
  lastKey: string | null;
}
