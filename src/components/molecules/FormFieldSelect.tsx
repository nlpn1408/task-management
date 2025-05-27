import React from "react";
import {
  Controller,
  type Control,
  type Path,
  type FieldValues,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FormFieldSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  isRequired?: boolean;
  className?: string;
  selectTriggerClassName?: string;
}

const FormFieldSelect = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  isRequired,
  className,
  selectTriggerClassName,
}: FormFieldSelectProps<TFieldValues>) => {
  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            <Label
              htmlFor={field.name}
              className={error ? "text-destructive" : ""}
            >
              {label}{" "}
              {isRequired && <span className="text-destructive">*</span>}
            </Label>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger
                id={field.name}
                className={`mt-2 w-full ${selectTriggerClassName || ""} ${
                  error
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                aria-invalid={error ? "true" : "false"}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-destructive mt-1">{error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default FormFieldSelect;
