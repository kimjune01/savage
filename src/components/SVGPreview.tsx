import { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SVGPreviewProps {
  svgContent: string;
  showCode?: boolean;
}

export default function SVGPreview({ svgContent, showCode = false }: SVGPreviewProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  if (showCode) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <SyntaxHighlighter
          language="xml"
          style={tomorrow}
          customStyle={{
            margin: 0,
            maxHeight: '400px',
            fontSize: '14px',
          }}
          showLineNumbers
        >
          {svgContent}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Controls */}
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Zoom: {Math.round(zoomLevel * 100)}%
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setZoomLevel(0.5)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xs"
          >
            50%
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xs"
          >
            100%
          </button>
          <button
            onClick={() => setZoomLevel(2)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xs"
          >
            200%
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="h-96 bg-white dark:bg-gray-900 relative">
        <TransformWrapper
          initialScale={zoomLevel}
          minScale={0.1}
          maxScale={5}
          onTransformed={(ref) => {
            setZoomLevel(ref.state.scale);
          }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 z-10 flex flex-col space-y-1">
                <button
                  onClick={() => zoomIn()}
                  className="p-2 bg-white dark:bg-gray-800 rounded shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => zoomOut()}
                  className="p-2 bg-white dark:bg-gray-800 rounded shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => resetTransform()}
                  className="p-2 bg-white dark:bg-gray-800 rounded shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <TransformComponent
                wrapperStyle={{
                  width: '100%',
                  height: '100%',
                }}
                contentStyle={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                  className="max-w-full max-h-full"
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* SVG Info */}
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>File size: {new Blob([svgContent]).size} bytes</span>
          <span>Elements: {(svgContent.match(/<\w+/g) || []).length}</span>
        </div>
      </div>
    </div>
  );
}