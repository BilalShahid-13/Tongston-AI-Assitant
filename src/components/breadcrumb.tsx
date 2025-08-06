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
    <Breadcrumb>
      <BreadcrumbList>
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
  );
};

export default BreadCrumb;
