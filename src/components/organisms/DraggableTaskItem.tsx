import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import TaskItem from "./TaskItem";
import type { Task } from "@/types";
import type { DndListeners } from "@/types/dnd";

interface DraggableTaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const DraggableTaskItem: React.FC<DraggableTaskItemProps> = ({
  task,
  onEdit,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task, type: "TASK_ITEM", originalStatus: task.status },
    });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : {};

  return (
    <TaskItem
      task={task}
      onEdit={onEdit}
      onDelete={onDelete}
      isDragging={isDragging}
      dndRef={setNodeRef}
      dndStyle={style}
      dndAttributes={attributes}
      dndListeners={listeners as DndListeners}
    />
  );
};

export default DraggableTaskItem;
