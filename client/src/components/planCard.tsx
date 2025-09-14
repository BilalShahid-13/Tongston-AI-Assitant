import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface IChildren {
  children: React.ReactNode,
  title: string,
  planTitle?: string,
  ctaButton?: React.ReactNode,
  ref?: React.Ref<HTMLDivElement>
  className?: string,
  des?: string,
  // isOpen: boolean,
  cardHeaderClassName?: string,
}

export default function PlanCard({ children,
  title = "Subject Lesson Plan & Notes Generator", ref,
  ctaButton, className, des, cardHeaderClassName }: IChildren) {

  // export default function PlanCard({ children, planTitle,
  //   title = "Subject Lesson Plan & Notes Generator", ref, isOpen,
  //   ctaButton, className, des, cardHeaderClassName }: IChildren) {


  // const { editButton } = useProjectTaskFacilitationStore()
  return (
    <>
      <Card ref={ref} className={className}>
        <CardHeader
          className="flex flex-col sm:flex-row justify-between gap-4 w-full items-start sm:items-center"
        >
          {/* Left section */}
          <div
            className={cn(
              `bg-gradient-to-l from-[var(--k12-tertiary)]/20 to-[var(--k12-tertiary)] text-white rounded-t-xl
              p-6 w-full flex flex-row justify-between items-center`,
              cardHeaderClassName
            )}
          >
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <p className="text-sm opacity-90">{des}</p>

            {/* {isOpen && (
              <DrawerLayout
                onTriggerName={
                  <>
                    <Button
                      variant={"secondary"}
                      id="edit-button"
                      onClick={editButton}
                      className="flex justify-center items-center gap-2 text-center
                 hover:bg-[var(--k12-tertiary)] cursor-pointer"
                    >
                      Refine / Edit
                      <Pencil />
                    </Button>
                  </>
                }
                headerName={planTitle}
              />
            )} */}
          </div>

          {/* Right section (button) */}

        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        <CardFooter>
          <CardAction>
            {ctaButton}
          </CardAction>
        </CardFooter>
      </Card>
    </>
  )
}
