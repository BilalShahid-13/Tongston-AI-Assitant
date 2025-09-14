import type { Path, UseFormReturn } from "react-hook-form";
import Required from "../Required";
import { FormField, FormItem, FormLabel } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "@/lib/utils";

interface IFormSchema<T extends Record<string, any>> {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName: string;
  placeholder?: string;
  list: Array<string>;
  isRequired?: boolean;
  className?: string,
  onChange?: (value: string) => void;
}

export default function CustomSelectField<T extends Record<string, any>>
  ({ form, name, isRequired = false,
    fieldName, placeholder = "Select a Location",
    list, className, onChange }: IFormSchema<T>) {
  return (
    <>
      <FormField
        name={name}
        control={form.control}
        render={({ field }) => (
          <FormItem id={name}>
            <FormLabel className="inline justify-start items-start leading-snug">{fieldName}
              {isRequired && <Required />}
            </FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                if (onChange) onChange(value);

              }}
              value={Array.isArray(field.value) ? field.value[0] : field.value}
            >
              <SelectTrigger className={cn("w-full", className)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className={className || "w-[250px]"}>
                {list.map((item) =>
                  <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </>
  )
}
