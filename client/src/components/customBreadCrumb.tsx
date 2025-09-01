import BreadCrumb from "./breadcrumb";

export default function CustomBreadCrumb({}:{}) {
  return (
    <>
      <div className="w-full h-12 bg-gradient-to-r
            from-[var(--k12-tertiary)]/80 to-[var(--k12-tertiary)] px-4 rounded-b-md
             flex justify-start items-center shadow-md">
        <BreadCrumb section="Help & FAQs" className="text-white z-20" />
      </div>
    </>
  )
}
