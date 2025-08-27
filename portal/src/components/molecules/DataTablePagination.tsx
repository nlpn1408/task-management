import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Icon from "@/components/atoms/Icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  rowsPerPageOptions?: number[];
  totalTasks?: number;
}

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [10, 20, 30, 50];

export function DataTablePagination<TData>({
  table,
  rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE_OPTIONS,
  totalTasks,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div className="flex flex-col items-center gap-y-4 p-4 border-t sm:flex-row sm:justify-between">
      <div className="text-sm text-muted-foreground self-center sm:self-auto">
        Total:{" "}
        {totalTasks !== undefined
          ? totalTasks
          : table.getFilteredRowModel().rows.length}{" "}
        tasks
      </div>
      <div className="flex flex-col items-center gap-y-4 sm:flex-row sm:items-center sm:gap-x-4 md:gap-x-6 lg:gap-x-8">
        <div className="flex items-center gap-x-2">
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            Rows per page:
          </p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {rowsPerPageOptions.map((option) => (
                <SelectItem key={option} value={`${option}`}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium whitespace-nowrap">
          Page {pageIndex + 1} of{" "}
          {table.getPageCount() === 0 ? 1 : table.getPageCount()}
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to first page"
          >
            <Icon name="ChevronsLeft" className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
          >
            <Icon name="ChevronLeft" className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to next page"
          >
            <Icon name="ChevronRight" className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Go to last page"
          >
            <Icon name="ChevronsRight" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
