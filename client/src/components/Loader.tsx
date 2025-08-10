import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export const Loader = () => {
  const width_height = "w-7 h-7";
  return (<div className="flex w-full h-screen justify-center items-center space-x-1">
    <div className={`${width_height} bg-yellow-400 rounded-full animate-bounce`}
      style={{
        animationDelay: "-0.3s"
      }}></div><div className={`${width_height} bg-yellow-500 rounded-full animate-bounce`}
        style={{
          animationDelay: "-0.3s"
        }}></div><div className={`${width_height} bg-yellow-600 rounded-full animate-bounce`}></div></div>
  )
}

export const Error = () => {
  return (
    <Alert variant="destructive">
      <Terminal />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Somethings went wrong please try again
      </AlertDescription>
    </Alert>
  )
}

export const CustomError = ({ planNames }: { planNames: string | string[] }) => {
  return (
    <Alert variant="default">
      <AlertTitle>No &nbsp;
        <span className="bg-primary">
          {Array.isArray(planNames)
            ? planNames.map((name) => name).join(", ")
            : planNames}
        </span> plans found</AlertTitle>
      <AlertDescription>
        There are currently no lesson plans available.
      </AlertDescription>
    </Alert>
  )

}