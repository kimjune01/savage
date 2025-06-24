import { useState, useEffect } from 'react';
import { X, FileImage } from 'lucide-react';

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

export default function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-start space-x-4">
        {/* Image Thumbnail */}
        <div className="flex-shrink-0">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-16 w-16 object-cover rounded border border-gray-200 dark:border-gray-600"
            />
          ) : (
            <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center">
              <FileImage className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)} • {file.type}
              </p>
            </div>
            <button
              onClick={onRemove}
              className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}