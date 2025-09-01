import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import type { breadcrumbProps } from "@/types";

const BreadCrumb = ({ section, currentPage, className }: breadcrumbProps) => {
  return (
    <div className="w-full h-12 bg-gradient-to-r
            from-[var(--k12-tertiary)]/80 to-[var(--k12-tertiary)] px-4 rounded-b-md
             flex justify-start items-center shadow-md ">
      <Breadcrumb>
        <BreadcrumbList className="text-white dark:text-zinc-700">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className={cn(`max-sm:text-sm`, className)}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className={cn(`max-sm:text-sm`, className)}>{section}</BreadcrumbLink>
          </BreadcrumbItem>
          {currentPage && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className={cn(`max-sm:text-sm`, className)}>
                  {currentPage}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )
          }
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
