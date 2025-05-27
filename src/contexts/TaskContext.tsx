import React, { createContext, useReducer, useContext } from "react";
import type { ReactNode, Dispatch } from "react";
import type { Task, TaskStatus } from "@/types";
import moment from "moment";
import type { TaskFormData } from "@/components/organisms/TaskForm";
import { mockTasks } from "@/services/mockData";

let nextMockId = mockTasks.length;
const generateId = (): string => {
  return (nextMockId++).toString();
};

const createTaskCode = (taskId: string): string => {
  const paddedId = taskId.padStart(6, "0");
  return `T-${paddedId.substring(0, 6).toUpperCase()}`;
};

interface TaskState {
  tasks: Task[];
  searchTerm: string;
  statusFilter: TaskStatus[];
}

interface SetTasksAction {
  type: "SET_TASKS";
  payload: Task[];
}
interface AddTaskAction {
  type: "ADD_TASK";
  payload: Omit<TaskFormData, "id" | "taskCode">;
}
interface UpdateTaskAction {
  type: "UPDATE_TASK";
  payload: Partial<TaskFormData> & { id: string };
}
interface DeleteTaskAction {
  type: "DELETE_TASK";
  payload: string /* id of task to delete */;
}
interface SetSearchTermAction {
  type: "SET_SEARCH_TERM";
  payload: string;
}
interface SetStatusFilterAction {
  type: "SET_STATUS_FILTER";
  payload: TaskStatus[];
}

export type TaskAction =
  | SetTasksAction
  | AddTaskAction
  | UpdateTaskAction
  | DeleteTaskAction
  | SetSearchTermAction
  | SetStatusFilterAction;

const initialState: TaskState = {
  tasks: [],
  searchTerm: "",
  statusFilter: [],
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload };
    case "ADD_TASK": {
      const newTaskId = generateId();
      const newTask: Task = {
        id: newTaskId,
        taskCode: createTaskCode(newTaskId),
        title: action.payload.title,
        description: action.payload.description || "",
        status: action.payload.status,
        createdAt: moment().toISOString(),
        updatedAt: moment().toISOString(),
      };
      return { ...state, tasks: [...state.tasks, newTask] };
    }
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? {
                ...task,
                ...action.payload,
                updatedAt: moment().toISOString(),
              }
            : task
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_STATUS_FILTER":
      return { ...state, statusFilter: action.payload };
    default:
      return state;
  }
};

interface TaskContextType extends TaskState {
  dispatch: Dispatch<TaskAction>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
  initialMockTasks?: Task[];
}

export const TaskProvider: React.FC<TaskProviderProps> = ({
  children,
  initialMockTasks,
}) => {
  const [state, dispatch] = useReducer(taskReducer, {
    ...initialState,
    tasks: initialMockTasks || [],
  });

  if (initialMockTasks && initialMockTasks.length > 0) {
    const maxId = initialMockTasks.reduce((max, task) => {
      const numericId = parseInt(task.id, 10);
      return numericId > max ? numericId : max;
    }, 0);
    nextMockId = maxId + 1;
  }

  return (
    <TaskContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
