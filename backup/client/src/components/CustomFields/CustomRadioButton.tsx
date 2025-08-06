import { cn } from "@/lib/utils";
import type { Path, UseFormReturn } from "react-hook-form";
import Required from "../Required";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface IFormSchema<T extends Record<string, any>> {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName: string;
  placeholder?: string;
  list: Array<string>;
  isRequired?: boolean;
  className?: string;
  defaultValue: string;
}

export default function CustomRadioButton<T extends Record<string, any>>({
  form,
  name,
  fieldName,
  isRequired = false,
  list,
  className,
  defaultValue
}: IFormSchema<T>) {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem id={name}>
          <FormLabel className="inline justify-start items-start leading-snug">
            {fieldName}
            {isRequired && <Required />}
          </FormLabel>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={defaultValue}
            className={cn("grid grid-cols-2 gap-x-3 gap-y-3", className)}
          >
            {list.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <RadioGroupItem id={item} value={item} />
                <FormLabel
                  htmlFor={item}
                  className="mb-0 space-y-3 font-normal leading-snug"
                >
                  {item}
                </FormLabel>
              </div>
            ))}
          </RadioGroup>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
