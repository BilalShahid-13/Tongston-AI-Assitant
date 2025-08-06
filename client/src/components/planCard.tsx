import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface IChildren {
  children: React.ReactNode,
  title: string,
  ctaButton?: React.ReactNode,
  ref?: React.Ref<HTMLDivElement>
  className?: string
}

export default function PlanCard({ children, title = "Subject Lesson Plan & Notes Generator", ref,
  ctaButton, className }: IChildren) {
  return (
    <>
      <Card ref={ref} className={className}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold font-inter">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        <CardFooter>
          <CardAction>
            {ctaButton}
            {/* <Button className="bg-amber-300 text-zinc-800
              hover:bg-amber-400 active:bg-amber-300 cursor-pointer"><Wand />Generate Lesson Plan</Button> */}
          </CardAction>
        </CardFooter>
      </Card>
    </>
  )
}
