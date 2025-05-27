import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTasks } from "@/contexts/TaskContext";
import type { TaskStatus } from "@/types";
import { TASK_STATUSES } from "@/types";
import Icon from "@/components/atoms/Icon";

const StatusFilter: React.FC = () => {
  const { statusFilter: selectedStatuses, dispatch } = useTasks();

  const handleStatusChange = (status: TaskStatus) => {
    const newSelectedStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    dispatch({ type: "SET_STATUS_FILTER", payload: newSelectedStatuses });
  };

  const getButtonText = () => {
    if (
      selectedStatuses.length === 0 ||
      selectedStatuses.length === TASK_STATUSES.length
    ) {
      return "All Statuses";
    }
    if (selectedStatuses.length === 1) {
      return selectedStatuses[0];
    }
    return `${selectedStatuses.length} Selected`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[180px] sm:w-[200px] justify-between"
        >
          {getButtonText()}
          <Icon name="ChevronDown" className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="end">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {TASK_STATUSES.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={selectedStatuses.includes(status)}
            onCheckedChange={() => handleStatusChange(status)}
            onSelect={(e) => e.preventDefault()} // Prevent closing on select
          >
            {status}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusFilter;
