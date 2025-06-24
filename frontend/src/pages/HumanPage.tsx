import React, { useState } from 'react';
import axios from 'axios';

interface ApiResponse {
  success: boolean;
  analysis?: string;
  error?: string;
  timestamp: string;
}

const HumanPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAnalysis = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Fetch the jk.png image from public folder
      const imageResponse = await fetch('/jk.png');
      const imageBlob = await imageResponse.blob();
      
      // Create FormData and append the image
      const formData = new FormData();
      formData.append('image', imageBlob, 'jk.png');

      const response = await axios.post('/api/verify-generation', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        setResult(err.response.data);
      } else {
        setError('API verification failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    handleGenerateAnalysis();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Human-in-the-Loop Image Verification
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Reference Image</h2>
          <div className="flex justify-center mb-4">
            <img 
              src="/jk.png" 
              alt="Reference image" 
              className="max-w-md h-auto rounded-lg border border-gray-200"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Prompt</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">
              Analyze this image and describe what you see. Focus on colors, shapes, and style.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-center mb-6">
            <button
              onClick={handleGenerateAnalysis}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {loading ? 'Analyzing image...' : 'Generate Analysis'}
            </button>
          </div>

          {loading && (
            <div className="flex justify-center mb-4">
              <div 
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                role="status"
              ></div>
            </div>
          )}

          {result && result.success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Analysis Result:</h3>
              <p className="text-green-700">{result.analysis}</p>
              <p className="text-sm text-green-600 mt-2">
                Generated at: {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
          )}

          {((result && !result.success) || error) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error:</h3>
              <p className="text-red-700">{result?.error || error}</p>
              <button
                onClick={handleRetry}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HumanPage;