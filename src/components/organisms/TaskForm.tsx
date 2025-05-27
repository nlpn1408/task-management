import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Task, TaskStatus } from "@/types";
import { TASK_STATUSES } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormFieldInput from "@/components/molecules/FormFieldInput";
import FormFieldTextarea from "@/components/molecules/FormFieldTextarea";
import FormFieldSelect from "@/components/molecules/FormFieldSelect";

const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(100, { message: "Title must be 100 characters or less." }),
  description: z
    .string()
    .max(500, { message: "Description must be 500 characters or less." })
    .optional(),
  status: z.enum(TASK_STATUSES as [string, ...string[]], {
    message: "Invalid status.",
  }) as z.ZodType<TaskStatus>,
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<Task>;
  isLoading?: boolean;
}

const statusSelectOptions = TASK_STATUSES.map((status) => ({
  value: status,
  label: status,
}));

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
}) => {
  const { control, handleSubmit, reset } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || "Todo",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "Todo",
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {initialData?.taskCode && (
        <div className="space-y-2">
          <Label htmlFor="taskCodeDisplay">Task Code</Label>
          <Input
            id="taskCodeDisplay"
            value={initialData.taskCode}
            readOnly
            disabled
            className="bg-muted/50 cursor-not-allowed"
          />
        </div>
      )}

      <FormFieldInput<TaskFormData>
        control={control}
        name="title"
        label="Title"
        isRequired
      />

      <FormFieldTextarea<TaskFormData>
        control={control}
        name="description"
        label="Description"
        rows={4}
      />

      <FormFieldSelect<TaskFormData>
        control={control}
        name="status"
        label="Status"
        isRequired
        options={statusSelectOptions}
        placeholder="Select status"
      />

      <div className="flex justify-end space-x-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? initialData
              ? "Saving..."
              : "Creating..."
            : initialData
            ? "Save Changes"
            : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
