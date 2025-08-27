import Icon from "@/components/atoms/Icon";
import { DataTableColumnHeader } from "@/components/molecules/DataTableColumnHeader";
import { DataTablePagination } from "@/components/molecules/DataTablePagination";
import DeleteTaskDialog from "@/components/molecules/DeleteTaskDialog";
import TaskActionsDropdown from "@/components/molecules/TaskActionsDropdown";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Task, TaskStatus } from "@/types";
import { getStatusBadgeStyleProps } from "@/utils/styleUtils";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import moment from "moment";
import React, { useMemo, useState } from "react";

interface TaskTableProps {
  tasks: Task[];
  searchTerm: string;
  statusFilter: TaskStatus[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const ROWS_PER_PAGE_OPTIONS = [10, 20, 30, 50];

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  searchTerm,
  statusFilter,
  onEdit,
  onDelete,
}) => {
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    return tasks.filter((task) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        task.taskCode.toLowerCase().includes(lowerSearchTerm) ||
        task.title.toLowerCase().includes(lowerSearchTerm);

      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(task.status);

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, statusFilter]);

  const columns: ColumnDef<Task>[] = useMemo(
    () => [
      {
        accessorKey: "taskCode",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Code" />
        ),
        cell: (info) => (
          <div
            title={info.getValue() as string}
            className="truncate w-[80px] sm:w-[100px]"
          >
            {info.getValue() as string}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: (info) => (
          <div className="break-words min-w-[150px]">
            {info.getValue() as string}
          </div>
        ),
        size: 250,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: (info) => {
          const statusValue = info.getValue() as TaskStatus;
          const statusStyle = getStatusBadgeStyleProps(statusValue);
          return (
            <Badge
              variant={statusStyle.variant}
              className={`capitalize w-24 text-center justify-center ${
                statusStyle.className || ""
              }`}
            >
              {statusValue}
            </Badge>
          );
        },
        size: 150,
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (info) => (
          <div className="truncate max-w-xs hidden md:table-cell">
            {(info.getValue() as string) || "-"}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: (info) => (
          <div className=" text-xs">
            {moment(info.getValue() as string).format("MMM D, YYYY")}
          </div>
        ),
        size: 150,
      },
      {
        accessorKey: "updatedAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Updated At" />
        ),
        cell: (info) => (
          <div className="text-xs">
            {moment(info.getValue() as string).fromNow()}
          </div>
        ),
        size: 150,
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <TaskActionsDropdown
              onEditClick={() => onEdit(row.original)}
              onDeleteClick={() => openDeleteDialog(row.original)}
            />
          </div>
        ),
        size: 100,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: ROWS_PER_PAGE_OPTIONS[0],
        pageIndex: 0,
      },
    },
  });

  const openDeleteDialog = (task: Task) => {
    setTaskToDelete(task);
  };

  const closeDeleteDialog = () => {
    setTaskToDelete(null);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      onDelete(taskToDelete.id);
      closeDeleteDialog();
    }
  };

  const getTableEmptyState = () => {
    if (searchTerm === "" && statusFilter.length === 0) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center text-center py-10">
          <Icon
            name="Inbox"
            size={48}
            className="mx-auto text-muted-foreground mb-4"
          />
          <p className="text-xl text-muted-foreground mb-2">No tasks yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first task to get started!
          </p>
        </div>
      );
    }
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center py-10">
        <Icon
          name="SearchX"
          size={48}
          className="mx-auto text-muted-foreground mb-4"
        />
        <p className="text-xl text-muted-foreground mb-2">
          No tasks match your filters
        </p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or status filters.
        </p>
      </div>
    );
  };

  return (
    <div className="bg-card border rounded-md flex flex-col min-h-[700px] mt-4">
      {filteredData.length === 0 ? (
        getTableEmptyState()
      ) : (
        <>
          <div className="flex-grow overflow-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{
                          width:
                            header.column.getSize() !== 150
                              ? header.column.getSize()
                              : undefined,
                        }}
                        className="px-2 py-3 first:pl-4 last:pr-4"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{
                            width:
                              cell.column.getSize() !== 150
                                ? cell.column.getSize()
                                : undefined,
                          }}
                          className="py-3 px-2 first:pl-4 last:pr-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <DataTablePagination
            table={table}
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            totalTasks={filteredData.length}
          />

          {taskToDelete && (
            <DeleteTaskDialog
              isOpen={!!taskToDelete}
              onOpenChange={(isOpen) => !isOpen && closeDeleteDialog()}
              onConfirmDelete={confirmDelete}
              taskTitle={taskToDelete.title}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TaskTable;
