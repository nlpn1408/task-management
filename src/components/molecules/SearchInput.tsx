import React from "react";
import { Input } from "@/components/ui/input";
import Icon from "@/components/atoms/Icon";

// Use React.ComponentProps to get props from the Shadcn Input component
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
  debounceTimeout = 300,
  className,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = React.useState(initialValue);

  React.useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchTerm);
    }, debounceTimeout);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearchChange, debounceTimeout]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
