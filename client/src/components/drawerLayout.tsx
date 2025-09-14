import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useOnError } from "@/hooks/useOnError";
import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import * as z from "zod";
import CustomTextArea from "./CustomFields/CustomTextArea";
import { Button } from "./ui/button";
import { RefreshCw, Sparkles } from "lucide-react";
import { useLessonStore } from "@/store/lessonStore";

interface DrawerLayoutProps {
  onTriggerName: React.ReactNode
  headerName: string | undefined;
}

const formSchema = z.object({
  name: z.string(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function DrawerLayout({ onTriggerName, headerName }: DrawerLayoutProps) {
  const form: UseFormReturn<FormSchemaType> = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const { setCurrentLesson } = useLessonStore();
  const onSubmit = (data: FormSchemaType) => {
    console.log(data);
  };

  return (
    <>
      <Drawer direction="right">
        <DrawerTrigger>{onTriggerName}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Refine {headerName}</DrawerTitle>
            <DrawerDescription>
              <div className="space-y-4">
                <FormProvider {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit, useOnError())}>
                    <CustomTextArea
                      form={form}
                      name="name"
                      fieldHeight="xl"
                      isDisabled={form.formState.isSubmitting}
                      isRequired={false}
                      fieldName="Tell the AI what to change..."
                      placeholder="e.g., Make it more engaging for visual learners, add more hands-on activities, simplify the language, include more real-world examples..."
                    />
                  </form>
                </FormProvider>
                <DrawerClose className="w-full">
                  <Button variant={"outline"}
                    onClick={() => setCurrentLesson(false)}
                    className="text-black dark:text-white w-full">
                    <RefreshCw />
                    Generate New
                  </Button>
                </DrawerClose>
              </div>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="w-full">
            <Button>
              <Sparkles />
              Apply Refinements
            </Button>
            <DrawerClose >
              <Button className="w-full" variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
