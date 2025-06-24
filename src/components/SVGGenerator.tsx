import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, Download, Copy, Eye, Code } from 'lucide-react';
import { generateSVG } from '../services/api';
import SVGPreview from './SVGPreview';
import ImagePreview from './ImagePreview';

export default function SVGGenerator() {
  const [textPrompt, setTextPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSVG, setGeneratedSVG] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedImage(file);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    multiple: false,
  });

  const handleGenerate = async () => {
    if (!textPrompt.trim() && !uploadedImage) {
      setError('Please enter a text prompt or upload an image');
      return;
    }

    if (textPrompt.trim() && textPrompt.trim().length < 10) {
      setError('Please enter at least 10 characters');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateSVG(textPrompt.trim(), uploadedImage);
      setGeneratedSVG(response.svg);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedSVG) return;

    const blob = new Blob([generatedSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-svg-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = async () => {
    if (!generatedSVG) return;

    try {
      await navigator.clipboard.writeText(generatedSVG);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI-Powered SVG Generator
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create scalable vector graphics using text prompts and reference images
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Text Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Text Prompt
            </label>
            <textarea
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              placeholder="Describe the SVG you want to create (e.g., 'A minimalist mountain landscape with a sunset')"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              rows={4}
            />
            {textPrompt.trim() && textPrompt.trim().length < 10 && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                Please enter at least 10 characters
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reference Image (Optional)
            </label>
            {!uploadedImage ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {isDragActive
                    ? 'Drop the image here'
                    : 'Drag & drop an image here, or click to select'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  JPEG, PNG, WebP up to 20MB
                </p>
              </div>
            ) : (
              <ImagePreview file={uploadedImage} onRemove={clearImage} />
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || (!textPrompt.trim() && !uploadedImage)}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Palette className="h-4 w-4" />
                <span>Generate SVG</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          {generatedSVG ? (
            <>
              {/* Controls */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Generated SVG
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title={showCode ? 'View Preview' : 'View Code'}
                  >
                    {showCode ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="Copy Code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 flex items-center space-x-1 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Preview/Code */}
              <SVGPreview svgContent={generatedSVG} showCode={showCode} />
            </>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-center">
                <Palette className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Your generated SVG will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}