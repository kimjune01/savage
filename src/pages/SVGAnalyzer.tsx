import { useState } from 'react';
import { Upload, FileText, Zap, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { analyzeSVG, optimizeSVG, validateSVG } from '../services/api';
import SVGPreview from '../components/SVGPreview';

export default function SVGAnalyzer() {
  const [svgContent, setSvgContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<{
    complexity_score: number;
    element_count: number;
    file_size: number;
    recommendations: string[];
  } | null>(null);
  const [optimization, setOptimization] = useState<{
    optimized_svg: string;
    original_size: number;
    optimized_size: number;
    reduction_percentage: number;
  } | null>(null);
  const [validation, setValidation] = useState<{
    is_valid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analyze' | 'optimize' | 'validate'>('analyze');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'image/svg+xml') {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setSvgContent(content);
        // Clear previous results
        setAnalysis(null);
        setOptimization(null);
        setValidation(null);
        setError(null);
      };
      reader.readAsText(selectedFile);
    } else {
      setError('Please select a valid SVG file');
    }
  };

  const handleAnalyze = async () => {
    if (!svgContent.trim()) {
      setError('Please upload an SVG file or paste SVG content');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeSVG(svgContent);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!svgContent.trim()) {
      setError('Please upload an SVG file or paste SVG content');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await optimizeSVG(svgContent);
      setOptimization(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Optimization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!svgContent.trim()) {
      setError('Please upload an SVG file or paste SVG content');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await validateSVG(svgContent);
      setValidation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadOptimized = () => {
    if (!optimization?.optimized_svg) return;

    const blob = new Blob([optimization.optimized_svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized-${file?.name || 'svg'}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const tabs = [
    { id: 'analyze', label: 'Analyze', icon: FileText },
    { id: 'optimize', label: 'Optimize', icon: Zap },
    { id: 'validate', label: 'Validate', icon: CheckCircle },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          SVG Analyzer
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Analyze, optimize, and validate your SVG files
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload SVG File
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> an SVG file
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SVG files only</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Loaded: {file.name} ({formatFileSize(file.size)})
              </p>
            )}
          </div>

          {/* SVG Content Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Or Paste SVG Content
            </label>
            <textarea
              value={svgContent}
              onChange={(e) => setSvgContent(e.target.value)}
              placeholder="Paste your SVG content here..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
              rows={8}
            />
          </div>

          {/* Action Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'analyze' | 'optimize' | 'validate')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {activeTab === 'analyze' && (
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !svgContent.trim()}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>{isLoading ? 'Analyzing...' : 'Analyze SVG'}</span>
              </button>
            )}

            {activeTab === 'optimize' && (
              <button
                onClick={handleOptimize}
                disabled={isLoading || !svgContent.trim()}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Zap className="h-4 w-4" />
                <span>{isLoading ? 'Optimizing...' : 'Optimize SVG'}</span>
              </button>
            )}

            {activeTab === 'validate' && (
              <button
                onClick={handleValidate}
                disabled={isLoading || !svgContent.trim()}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>{isLoading ? 'Validating...' : 'Validate SVG'}</span>
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* SVG Preview */}
          {svgContent && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                SVG Preview
              </h3>
              <SVGPreview svgContent={svgContent} />
            </div>
          )}

          {/* Analysis Results */}
          {activeTab === 'analyze' && analysis && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Analysis Results
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Elements</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {analysis.elements_count}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">File Size</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatFileSize(analysis.file_size)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Complexity</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {analysis.complexity_score}/100
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Animations</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {analysis.has_animations ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Suggestions</h4>
                  <ul className="space-y-1">
                    {analysis.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                        <span className="text-blue-500">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Optimization Results */}
          {activeTab === 'optimize' && optimization && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Optimization Results
                </h3>
                <button
                  onClick={downloadOptimized}
                  className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 text-sm"
                >
                  Download Optimized
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Original Size</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatFileSize(optimization.original_size)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Optimized Size</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatFileSize(optimization.optimized_size)}
                  </p>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/50 p-3 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Size reduction: {optimization.reduction_percentage.toFixed(1)}%
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Optimized SVG Preview</h4>
                <SVGPreview svgContent={optimization.optimized_svg} />
              </div>
            </div>
          )}

          {/* Validation Results */}
          {activeTab === 'validate' && validation && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Validation Results
              </h3>
              
              <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                validation.is_valid
                  ? 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300'
              }`}>
                {validation.is_valid ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span className="font-medium">
                  {validation.is_valid ? 'Valid SVG' : 'Invalid SVG'}
                </span>
              </div>

              {validation.errors && validation.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-300 mb-2 flex items-center space-x-2">
                    <XCircle className="h-4 w-4" />
                    <span>Errors</span>
                  </h4>
                  <ul className="space-y-1">
                    {validation.errors.map((error: string, index: number) => (
                      <li key={index} className="text-sm text-red-600 dark:text-red-400 flex items-start space-x-2">
                        <span className="text-red-500">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.warnings && validation.warnings.length > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Warnings</span>
                  </h4>
                  <ul className="space-y-1">
                    {validation.warnings.map((warning: string, index: number) => (
                      <li key={index} className="text-sm text-yellow-600 dark:text-yellow-400 flex items-start space-x-2">
                        <span className="text-yellow-500">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.suggestions && validation.suggestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Suggestions</h4>
                  <ul className="space-y-1">
                    {validation.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="text-sm text-blue-600 dark:text-blue-400 flex items-start space-x-2">
                        <span className="text-blue-500">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}