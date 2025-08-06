import type { Path, UseFormReturn } from "react-hook-form";
import Required from "../Required";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";

interface IFormSchema<T extends Record<string, any>> {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName: string;
  placeholder?: string;
  isRequired?: boolean
  isDisabled?: boolean;
}

export default function CustomTextArea<T extends Record<string, any>>({ name, fieldName, isDisabled = false,
  form, isRequired = false, placeholder = "Select a Location" }: IFormSchema<T>) {
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
            <FormControl>
              <Textarea
                disabled={isDisabled}
                placeholder={placeholder}
                {...field}
                className="resize-none max-h-32" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
