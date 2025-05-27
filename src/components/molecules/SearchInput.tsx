import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Icon from "@/components/atoms/Icon";

interface SearchInputProps
  extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  onSearchChange: (value: string) => void;
  initialValue?: string;
  debounceTimeout?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearchChange,
  initialValue = "",
  placeholder = "Search...",
  className,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className={`relative flex items-center ${className || ""}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className={`pl-10 pr-4 py-2 h-10 rounded-md border ${
          props.disabled ? "bg-muted/50 cursor-not-allowed" : ""
        }`}
        {...props}
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Icon name="Search" size={18} />
      </div>
    </div>
  );
};

export default SearchInput;
