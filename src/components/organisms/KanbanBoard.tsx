import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent, Over } from "@dnd-kit/core";
// import { arrayMove } from "@dnd-kit/sortable"; // Removed: No longer reordering within columns
import { useTasks } from "@/contexts/TaskContext";
import type { Task, TaskStatus } from "@/types";
import { TASK_STATUSES } from "@/types";
import KanbanColumn from "./KanbanColumn";
import TaskItem from "./TaskItem";

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

interface DndData {
  task: Task;
  type: string;
  originalStatus: TaskStatus;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks, // This is kanbanFilteredTasks from HomePage
  onEditTask,
  onDeleteTask,
}) => {
  const { dispatch } = useTasks();
  const [activeTaskForOverlay, setActiveTaskForOverlay] = useState<Task | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const tasksByStatus = TASK_STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const handleDragStart = (event: DragStartEvent) => {
    const activeData = event.active.data.current as DndData | undefined;
    if (activeData?.type === "TASK_ITEM") {
      setActiveTaskForOverlay(activeData.task);
    } else {
      setActiveTaskForOverlay(null);
    }
  };

  const determineTargetStatus = (over: Over | null): TaskStatus | null => {
    if (!over || !over.id) return null;
    const overId = over.id as string;
    if (TASK_STATUSES.includes(overId as TaskStatus)) {
      return overId as TaskStatus;
    }
    return null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTaskForOverlay(null);
    const { active, over } = event;

    if (!over || !active.data.current) return;

    const activeData = active.data.current as DndData;
    const draggedTask = activeData.task;
    const originalStatus = activeData.originalStatus;

    const targetStatus = determineTargetStatus(over);

    if (!targetStatus || targetStatus === originalStatus) {
      return;
    }

    const updatedMovedTask: Task = {
      ...draggedTask,
      status: targetStatus,
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: "UPDATE_TASK", payload: updatedMovedTask });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 overflow-x-auto py-4 min-h-[calc(100vh-250px)]">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status] || []}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTaskForOverlay ? (
          <TaskItem task={activeTaskForOverlay} isDragging={true} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
