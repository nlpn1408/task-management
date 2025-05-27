import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/atoms/Icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskActionsDropdownProps {
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const TaskActionsDropdown: React.FC<TaskActionsDropdownProps> = ({
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          aria-label="Task actions"
        >
          <Icon name="Ellipsis" size={18} />
          <span className="sr-only">Task actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEditClick}>
          <Icon name="FilePenLine" size={16} className="mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDeleteClick}
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <Icon name="Trash2" size={16} className="mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskActionsDropdown;
