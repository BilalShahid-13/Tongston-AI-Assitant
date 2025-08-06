import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Loader2, Plus, X } from "lucide-react"
import {
  AiOutlineFilePdf,
  AiOutlineFileImage,
  AiOutlineFileWord,
  AiOutlineFileText,
  AiOutlineFile,
} from "react-icons/ai"
import { useCallback, useRef, useState } from "react"
import { type UseFormReturn } from "react-hook-form"

interface FileUploaderProps {
  form: UseFormReturn<any>
  name: string
  label?: string
  multiple?: boolean
  accept?: string
  className?: string
}

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase()

  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
      return <AiOutlineFileImage className="text-blue-500" />
    case "pdf":
      return <AiOutlineFilePdf className="text-red-500" />
    case "doc":
    case "docx":
      return <AiOutlineFileWord className="text-blue-600" />
    case "txt":
      return <AiOutlineFileText className="text-gray-500" />
    default:
      return <AiOutlineFile className="text-muted-foreground" />
  }
}

export function FileUploader({
  form,
  name,
  label = "Upload Files",
  multiple = false,
  accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg", className
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const files: File[] = form.watch(name) || []

  const updateFiles = (newFiles: File[]) => {
    form.setValue(name, newFiles, { shouldValidate: true })
  }

  const handleFiles = useCallback(
    (newFiles: FileList) => {
      setIsLoading(true)
      const fileArray = multiple
        ? [...files, ...Array.from(newFiles)]
        : [newFiles[0]]

      updateFiles(fileArray)
      setTimeout(() => setIsLoading(false), 800)
    },
    [files, multiple]
  )

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleRemove = (index: number) => {
    const updated = [...files]
    updated.splice(index, 1)
    updateFiles(updated)
  }

  return (
    <div className={cn(`grid w-full gap-3`, className)}>
      <Label htmlFor={name}>{label}</Label>

      {/* Dropzone */}
      <div

        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center h-48 text-center p-4 text-sm cursor-pointer",
          isDragging ? "border-yellow-500 bg-yellow-50" : "border-gray-300", className
        )}
      >
        {isLoading ? (
          <Loader2 className="animate-spin text-yellow-500" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <Plus className="h-6 w-6 mb-1" />
            <p className="text-sm">Drag & drop your file(s) here</p>
            <p className="text-xs">or click to browse</p>
            <p className="text-xs mt-1 text-muted-foreground">
              Accepted: {accept}
            </p>
          </div>
        )}
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        id={name}
        ref={inputRef}
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files)
        }}
        className="hidden"
        multiple={multiple}
        accept={accept}
      />

      {/* File Preview */}
      {files?.length > 0 && (
        <div className="grid gap-2">
          {files.map((file, index) => (
            <Card key={index} className="relative px-3 py-2 flex flex-row items-start
            justify-between">
              <CardContent className="p-0 text-sm flex items-center
               justify-between truncate">
                <span className="truncate max-w-sm overflow-hidden flex flex-row justify-center
                items-center gap-2">
                  {getFileIcon(file.name)}
                  {file.name}
                </span>
              </CardContent>
              <button
                type="button"
                className="relative
                text-muted-foreground hover:text-red-500 cursor-pointer"
                onClick={() => handleRemove(index)}
              >
                <X size={16} />
              </button>
            </Card>
          ))}
        </div>
      )}
      <span className="input-error text-sm">{form?.formState?.errors[name]?.message as string}</span>
    </div>
  )
}
