import React, { useState, useEffect } from "react";
import type { Task } from "@/types";
import moment from "moment";
import TaskActionsDropdown from "@/components/molecules/TaskActionsDropdown";
import DeleteTaskDialog from "@/components/molecules/DeleteTaskDialog";
import { useDraggable } from "@dnd-kit/core";

interface KanbanTaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const KanbanTaskItem: React.FC<KanbanTaskItemProps> = ({ task, onEdit, onDelete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task, type: "TASK_ITEM", originalStatus: task.status },
  });

  useEffect(() => {}, [task.id, onDelete]);

  const handleEditClick = () => {
    if (onEdit) onEdit(task);
  };

  const handleDeleteTrigger = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) onDelete(task.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`bg-card p-4 sm:p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col touch-none  ${
          isDragging ? "opacity-75" : ""
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-grow min-w-0">
            {task.taskCode && (
              <div className="text-xs text-muted-foreground">
                {task.taskCode}
              </div>
            )}
            <div className="font-semibold text-primary line-clamp-1">
              {task.title}
            </div>
          </div>
          {(onEdit || onDelete) && (
            <TaskActionsDropdown
              onEditClick={onEdit ? handleEditClick : () => {}}
              onDeleteClick={onDelete ? handleDeleteTrigger : () => {}}
            />
          )}
        </div>

        {task.description && (
          <>
            <div className="text-sm text-foreground/80 mb-3 line-clamp-2">
              {task.description}
            </div>
          </>
        )}
        {!task.description && <div className="flex-grow"></div>}

        <div className="mt-auto pt-2 border-t border-border/50 text-xs text-muted-foreground min-h-12">
          <p className="mb-1">
            Created: {moment(task.createdAt).format("MMM D, YYYY h:mm A")}
          </p>
          {task.updatedAt !== task.createdAt && (
            <p>Updated: {moment(task.updatedAt).fromNow()}</p>
          )}
        </div>
      </div>

      {onDelete && (
        <DeleteTaskDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={handleDeleteConfirm}
          taskTitle={task.title}
        />
      )}
    </>
  );
};

export default KanbanTaskItem;
