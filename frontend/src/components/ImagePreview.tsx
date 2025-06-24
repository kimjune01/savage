'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface ImagePreviewProps {
  file: File
  onRemove: () => void
}

export default function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('')

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  return (
    <div className="relative group">
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          {previewUrl && (
            <img
              src={previewUrl}
              alt={file.name}
              className="w-12 h-12 object-cover rounded"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.size)} • {file.type}
            </p>
          </div>

          <button
            onClick={onRemove}
            title="Remove image"
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}