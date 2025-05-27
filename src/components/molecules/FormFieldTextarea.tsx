import React from "react";
import {
  Controller,
  type Control,
  type Path,
  type FieldValues,
} from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FormFieldTextareaProps<TFieldValues extends FieldValues>
  extends Omit<
    React.ComponentProps<typeof Textarea>,
    "name" | "value" | "onChange" | "onBlur"
  > {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  isRequired?: boolean;
}

const FormFieldTextarea = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  isRequired,
  className,
  ...textareaProps
}: FormFieldTextareaProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Label
            htmlFor={field.name}
            className={error ? "text-destructive" : ""}
          >
            {label} {isRequired && <span className="text-destructive">*</span>}
          </Label>
          <Textarea
            id={field.name}
            {...field}
            {...textareaProps}
            className={`mt-2 ${className || ""} ${
              error ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
            aria-invalid={error ? "true" : "false"}
          />
          {error && (
            <p className="text-sm text-destructive mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default FormFieldTextarea;
