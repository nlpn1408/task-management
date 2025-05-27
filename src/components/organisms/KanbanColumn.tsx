import React from "react";
import type { Task, TaskStatus } from "@/types";
import { useDroppable } from "@dnd-kit/core";
import DraggableTaskItem from "./DraggableTaskItem";
import { getStatusBadgeStyleProps } from "@/utils/styleUtils";
import { Badge } from "../ui/badge";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  onEditTask,
  onDeleteTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-full md:w-1/3 p-3 bg-muted/50 rounded-lg min-h-[400px] transition-colors duration-150 ease-in-out ${
        isOver ? "bg-primary/10 ring-2 ring-primary" : ""
      }`}
    >
      <h2 className="text-xl font-semibold mb-4 px-2 pb-4 border-b text-center text-foreground capitalize">
        {(() => {
          const styleProps = getStatusBadgeStyleProps(status);
          return (
            <Badge
              variant={styleProps?.variant ?? undefined}
              className={`capitalize w-20 ${styleProps.className || ""}`}
            >
              {status}
            </Badge>
          );
        })()}
      </h2>
      <div className="space-y-3 overflow-y-auto flex-grow pr-1 min-h-[200px]">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <DraggableTaskItem
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground text-center mt-4">
              No tasks in this status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
