import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, X, Upload, Loader2, Download, RefreshCw } from 'lucide-react';
import { generateIconSet, addIconToSet } from '../services/api';
import type { IconConcept, GeneratedIcon } from '../services/api';

export default function IconSetGenerator() {
  const [stylePrompt, setStylePrompt] = useState('');
  const [iconConcepts, setIconConcepts] = useState<IconConcept[]>([
    { name: '', description: '' }
  ]);
  const [referenceIcon, setReferenceIcon] = useState<File | null>(null);
  const [iconSize, setIconSize] = useState('24x24');
  const [strokeWidth, setStrokeWidth] = useState('2px');
  const [colorPalette, setColorPalette] = useState('monochrome');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIcon[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setReferenceIcon(file);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const addIconConcept = () => {
    setIconConcepts([...iconConcepts, { name: '', description: '' }]);
  };

  const removeIconConcept = (index: number) => {
    if (iconConcepts.length > 1) {
      setIconConcepts(iconConcepts.filter((_, i) => i !== index));
    }
  };

  const updateIconConcept = (index: number, field: 'name' | 'description', value: string) => {
    const updated = [...iconConcepts];
    updated[index][field] = value;
    setIconConcepts(updated);
  };

  const handleGenerateSet = async () => {
    const validConcepts = iconConcepts.filter(c => c.name.trim() && c.description.trim());
    
    if (!stylePrompt.trim()) {
      setError('Style prompt is required');
      return;
    }

    if (validConcepts.length === 0) {
      setError('At least one icon concept is required');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateIconSet({
        stylePrompt: stylePrompt.trim(),
        iconConcepts: validConcepts,
        referenceIcon,
        iconSize,
        strokeWidth,
        colorPalette,
      });

      setGeneratedIcons(response.iconSet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const retryFailedIcon = async (iconIndex: number) => {
    const failedIcon = generatedIcons[iconIndex];
    if (!failedIcon || failedIcon.success) return;

    setIsGenerating(true);

    try {
      const newIcon = await addIconToSet({
        stylePrompt,
        iconConcept: { name: failedIcon.name, description: '' },
        referenceIcon,
        iconSize,
        strokeWidth,
        colorPalette,
      });

      const updatedIcons = [...generatedIcons];
      updatedIcons[iconIndex] = newIcon;
      setGeneratedIcons(updatedIcons);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Retry failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadIconSet = () => {
    const successfulIcons = generatedIcons.filter(icon => icon.success);
    
    if (successfulIcons.length === 0) {
      setError('No successful icons to download');
      return;
    }

    // Create a ZIP-like structure by downloading individual SVGs
    successfulIcons.forEach(icon => {
      const blob = new Blob([icon.svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${icon.name}-icon.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Icon Set Generator
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Generate cohesive icon sets with consistent styling
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration Section */}
        <div className="space-y-6">
          {/* Style Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Style Prompt *
            </label>
            <textarea
              value={stylePrompt}
              onChange={(e) => setStylePrompt(e.target.value)}
              placeholder="Describe the style (e.g., 'Minimalist with thin lines and rounded corners')"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>

          {/* Reference Icon Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reference Icon (Optional)
            </label>
            {!referenceIcon ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Upload a reference icon to match the style
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {referenceIcon.name}
                </span>
                <button
                  onClick={() => setReferenceIcon(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Icon Size
              </label>
              <select
                value={iconSize}
                onChange={(e) => setIconSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="16x16">16x16</option>
                <option value="24x24">24x24</option>
                <option value="32x32">32x32</option>
                <option value="48x48">48x48</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stroke Width
              </label>
              <select
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="1px">1px</option>
                <option value="1.5px">1.5px</option>
                <option value="2px">2px</option>
                <option value="2.5px">2.5px</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color Palette
              </label>
              <select
                value={colorPalette}
                onChange={(e) => setColorPalette(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="monochrome">Monochrome</option>
                <option value="colorful">Colorful</option>
                <option value="duotone">Duotone</option>
              </select>
            </div>
          </div>

          {/* Icon Concepts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Icon Concepts *
              </label>
              <button
                onClick={addIconConcept}
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Icon</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {iconConcepts.map((concept, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={concept.name}
                    onChange={(e) => updateIconConcept(index, 'name', e.target.value)}
                    placeholder="Icon name (e.g., 'home')"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    value={concept.description}
                    onChange={(e) => updateIconConcept(index, 'description', e.target.value)}
                    placeholder="Description (e.g., 'House with roof')"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                  {iconConcepts.length > 1 && (
                    <button
                      onClick={() => removeIconConcept(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateSet}
            disabled={isGenerating}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Icon Set...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Generate Icon Set</span>
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

        {/* Results Section */}
        <div className="space-y-6">
          {generatedIcons.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Generated Icons ({generatedIcons.filter(i => i.success).length}/{generatedIcons.length})
                </h3>
                <button
                  onClick={downloadIconSet}
                  className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 flex items-center space-x-1 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Set</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {generatedIcons.map((icon, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      icon.success
                        ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    {icon.success ? (
                      <>
                        <div
                          className="h-16 w-16 mx-auto mb-2 flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: icon.svg }}
                        />
                        <p className="text-sm text-center text-gray-700 dark:text-gray-300 font-medium">
                          {icon.name}
                        </p>
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="h-16 w-16 mx-auto mb-2 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                          <X className="h-8 w-8 text-red-500" />
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-2">
                          {icon.name}
                        </p>
                        <button
                          onClick={() => retryFailedIcon(index)}
                          disabled={isGenerating}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50 flex items-center space-x-1 mx-auto"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Retry</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-center">
                <Plus className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Your generated icon set will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}