'use client'

import { useState } from 'react'
import { Upload, Wand2 } from 'lucide-react'
import ImagePreview from '@/components/ImagePreview'

export default function HomePage() {
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [svgResult, setSvgResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      setImage(files[0])
      setError('')
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setImage(files[0])
      setError('')
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsLoading(true)
    setError('')
    setSvgResult('')

    try {
      const formData = new FormData()
      formData.append('textPrompt', prompt)
      if (image) {
        formData.append('image', image)
      }

      const response = await fetch('/api/generate/svg', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.svg) {
        setSvgResult(data.svg)
      } else {
        setError(data.error || 'Failed to generate SVG')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate SVG')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Savage SVG Generator</h1>
          <p className="text-gray-600">Create beautiful SVGs from text prompts and images</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Prompt Input */}
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Text Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the SVG you want to create..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Image Drop Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Image (Optional)
            </label>
            
            {image ? (
              <ImagePreview 
                file={image} 
                onRemove={() => setImage(null)} 
              />
            ) : (
              <div
                onDrop={handleImageDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drop an image here or click to browse</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate SVG
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* SVG Result */}
        {svgResult && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Generated SVG</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* SVG Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                <div className="border rounded-lg p-4 bg-gray-50 flex items-center justify-center min-h-[200px]">
                  <div dangerouslySetInnerHTML={{ __html: svgResult }} />
                </div>
              </div>

              {/* SVG Code */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">SVG Code</h3>
                <textarea
                  value={svgResult}
                  readOnly
                  className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-xs"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(svgResult)}
                  className="mt-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
