"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { X, Upload, File, CheckCircle } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  className?: string
  label?: string
  description?: string
}

interface UploadedFile {
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  id: string
}

export function FileUpload({
  onFileSelect,
  accept = "*/*",
  multiple = false,
  maxSize = 10,
  className,
  label,
  description,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter((file) => {
      const sizeInMB = file.size / (1024 * 1024)
      return sizeInMB <= maxSize
    })

    if (validFiles.length > 0) {
      const newFiles: UploadedFile[] = validFiles.map((file) => ({
        file,
        progress: 0,
        status: "uploading",
        id: Math.random().toString(36).substr(2, 9),
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])
      onFileSelect(validFiles)

      // Simulate upload progress
      newFiles.forEach((uploadedFile) => {
        simulateUpload(uploadedFile.id)
      })
    }
  }

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            const newProgress = Math.min(file.progress + 10, 100)
            return {
              ...file,
              progress: newProgress,
              status: newProgress === 100 ? "completed" : "uploading",
            }
          }
          return file
        }),
      )
    }, 200)

    setTimeout(() => clearInterval(interval), 2000)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {label && <Label>{label}</Label>}

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          "hover:border-primary hover:bg-primary/5 cursor-pointer",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <div className="space-y-2">
          <p className="text-sm font-medium">Drop files here or click to browse</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          <p className="text-xs text-muted-foreground">Maximum file size: {maxSize}MB</p>
        </div>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((uploadedFile) => (
            <div key={uploadedFile.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <File className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadedFile.file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {uploadedFile.status === "uploading" && (
                    <Progress value={uploadedFile.progress} className="flex-1 h-2" />
                  )}
                  {uploadedFile.status === "completed" && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span className="text-xs">Uploaded</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(uploadedFile.id)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
