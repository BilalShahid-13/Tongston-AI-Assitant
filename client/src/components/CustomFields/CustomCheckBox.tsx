import { cn } from "@/lib/utils";
import type { Path, UseFormReturn } from "react-hook-form";
import Required from "../Required";
import { Checkbox } from "../ui/checkbox";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

type IFormSchema<T extends Record<string, any>> = | {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName: string;
  placeholder?: string;
  list: Array<string>;
  isRequired?: boolean;
  className?: string;
  column?: 1 | 2 | 3 | 4;
  isDisabled?: false;
  showReadonlyList?: undefined;
} | {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName: string;
  placeholder?: string;
  list: Array<string>;
  isRequired?: boolean;
  className?: string;
  column?: 1 | 2 | 3 | 4;
  isDisabled?: true;
  showReadonlyList: number;
}

export default function CustomCheckBox<T extends Record<string, any>>({
  form,
  name,
  isRequired = false,
  isDisabled = false,
  fieldName,
  list,
  className,
  column = 2,
  showReadonlyList,
}: IFormSchema<T>) {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => {
        let value: string[] = Array.isArray(field.value) ? field.value : [];

        const lockCount = isDisabled && showReadonlyList ? showReadonlyList : 0;

        const displayedList =
          isDisabled && showReadonlyList ? list.slice(0, lockCount) : list;

        // ✅ Only force-lock values if disabled
        if (isDisabled && lockCount > 0) {
          const forced = displayedList;
          const missing = forced.filter((item) => !value.includes(item));
          if (missing.length > 0) {
            value = [...value, ...missing];
            field.onChange(value);
          }
        }

        const handleChange = (item: string, checked: boolean, isLocked: boolean) => {
          if (isLocked) return;

          const updated = checked
            ? [...value, item]
            : value.filter((v) => v !== item);

          field.onChange(updated);
        };

        return (
          <FormItem id={name}>
            <FormLabel className="inline justify-start items-start leading-snug">
              {fieldName}
              {isRequired && <Required />}
            </FormLabel>

            <div className={cn(`grid grid-cols-${column} gap-x-3 gap-y-3`, className)}>
              {displayedList.map((item, index) => {
                const isLocked = isDisabled && index < lockCount;
                const isChecked = isLocked || value.includes(item);

                return (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox
                      id={item}
                      className="text-black"
                      checked={isChecked}
                      disabled={isLocked ? true : false}
                      onCheckedChange={(checked) =>
                        handleChange(item, !!checked, isLocked)
                      }
                    />
                    <FormLabel
                      className="mb-0 space-y-3 font-normal leading-snug"
                      htmlFor={item}
                    >
                      {item}
                    </FormLabel>
                  </div>
                );
              })}
            </div>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
