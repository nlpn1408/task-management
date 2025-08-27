import Icon from "@/components/atoms/Icon";
import SearchInput from "@/components/molecules/SearchInput";
import StatusFilter from "@/components/molecules/StatusFilter";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import TaskForm, { type TaskFormData } from "@/components/organisms/TaskForm";
import TaskTable from "@/components/organisms/TaskTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTasks } from "@/contexts/TaskContext";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "@/services/taskServices";
import type { Task } from "@/types";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type ViewMode = "list" | "kanban";

const HomePage: React.FC = () => {
  const {
    tasks,
    searchTerm,
    statusFilter: selectedStatuses,
    dispatch,
  } = useTasks();

  useEffect(() => {
    getTasks()
      .then((tasks) => {
        console.log("🚀 ~ HomePage ~ tasks:", tasks);
        dispatch({ type: "SET_TASKS", payload: tasks });
      })
      .catch((error) => {
        console.error("Failed to fetch tasks:", error);
        toast.error("Failed to load tasks");
      });
  }, [dispatch]);

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>("list");

  const kanbanFilteredTasks = tasks.filter((task) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearchTerm =
      task.taskCode.toLowerCase().includes(lowerSearchTerm) ||
      task.title.toLowerCase().includes(lowerSearchTerm);

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(task.status);

    return matchesSearchTerm && matchesStatus;
  });

  const openEditTaskDialog = (taskToEdit: Task) => {
    setEditingTask(taskToEdit);
    setIsFormDialogOpen(true);
  };

  const openCreateTaskDialog = () => {
    setEditingTask(null);
    setIsFormDialogOpen(true);
  };

  const closeTaskDialog = () => {
    setIsFormDialogOpen(false);
    setEditingTask(null);
    setIsSubmitting(false);
  };

  const handleFormSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);

    try {
      if (editingTask) {
        const updatedTask = await updateTask(editingTask.id, {
          ...editingTask,
          ...data,
        });
        console.log("🚀 ~ handleFormSubmit ~ updatedTask:", updatedTask);
        toast.success("Task updated successfully");
        dispatch({
          type: "UPDATE_TASK",
          payload: { ...updatedTask, id: editingTask.id },
        });
      } else {
        const newTask = await createTask(data);
        console.log("🚀 ~ handleFormSubmit ~ newTask:", newTask);
        toast.success("Task created successfully");
        dispatch({ type: "ADD_TASK", payload: newTask });
      }
    } catch (error) {
      console.error("🚀 ~ handleFormSubmit ~ error:", error);
      toast.error(
        editingTask ? "Failed to update task" : "Failed to create task"
      );
    } finally {
      setIsSubmitting(false);
      closeTaskDialog();
    }
  };

  const handleDeleteTask = async (taskIdToDelete: string) => {
    try {
      await deleteTask(taskIdToDelete);
      console.log("🚀 ~ handleDeleteTask ~ success");
      toast.success("Task deleted successfully");
      dispatch({ type: "DELETE_TASK", payload: taskIdToDelete });
    } catch (error) {
      console.error("🚀 ~ handleDeleteTask ~ error:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleSearchChange = (query: string) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: query });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-center mb-2 gap-4">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-4 w-full sm:w-auto">
          <SearchInput
            initialValue={searchTerm}
            onSearchChange={handleSearchChange}
            placeholder="Search tasks..."
            className="w-full sm:w-auto md:w-64 flex-shrink-0"
          />
          <StatusFilter />
          <ToggleGroup
            type="single"
            defaultValue="list"
            value={currentView}
            onValueChange={(value: ViewMode) => {
              if (value) setCurrentView(value);
            }}
            aria-label="View mode"
            className="w-full sm:w-auto justify-center flex-shrink-0"
          >
            <ToggleGroupItem
              value="list"
              aria-label="List view"
              className="w-1/2 sm:w-auto px-4"
            >
              <Icon name="List" className="h-4 w-4 mr-2" /> List
            </ToggleGroupItem>
            <ToggleGroupItem
              value="kanban"
              aria-label="Kanban view"
              className="w-1/2 sm:w-auto px-4"
            >
              <Icon name="LayoutGrid" className="h-4 w-4 mr-2" /> Kanban
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex w-full md:w-auto justify-end">
          <Button
            onClick={openCreateTaskDialog}
            aria-label="Add new task"
            className="w-full sm:w-auto flex-shrink-0"
          >
            <Icon name="Plus" className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Create Task</span>
          </Button>
        </div>
      </div>

      {currentView === "list" && (
        <TaskTable
          tasks={tasks}
          searchTerm={searchTerm}
          statusFilter={selectedStatuses}
          onEdit={openEditTaskDialog}
          onDelete={handleDeleteTask}
        />
      )}

      {currentView === "kanban" && (
        <KanbanBoard
          tasks={kanbanFilteredTasks}
          onEditTask={openEditTaskDialog}
          onDeleteTask={handleDeleteTask}
        />
      )}

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <TaskForm
              onSubmit={handleFormSubmit}
              onCancel={closeTaskDialog}
              initialData={editingTask || undefined}
              isLoading={isSubmitting}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
