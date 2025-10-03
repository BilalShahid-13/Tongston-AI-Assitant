import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface CustomSelectProps<T extends string> {
  value: T;
  onValueChange: (val: T) => void;
  placeholder?: string;
  items: { label: string; value: T }[];
  className?: string;
}

export function DashboardCustomSelect<T extends string>({
  value,
  onValueChange,
  placeholder = "Select an option",
  items,
  className,
}: CustomSelectProps<T>) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className ?? "w-64"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item,index) => (
          <SelectItem key={index} value={item.value}
          className="capitalize"
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
