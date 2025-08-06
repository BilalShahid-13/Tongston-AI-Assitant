import type { Path, UseFormReturn } from "react-hook-form";
import Required from "../Required";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface IFormSchema<T extends Record<string, any>> {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName: string;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
}

export default function CustomInputField<T extends Record<string, any>>({
  form,
  name,
  isRequired = false,
  isDisabled = true,
  fieldName,
  placeholder,
}: IFormSchema<T>) {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem id={name as string}>
          <FormLabel className="inline justify-start items-start leading-snug">
            {fieldName} {isRequired && <Required />}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              disabled={isDisabled}
              className="resize-none"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
