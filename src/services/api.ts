import axios from 'axios';

const API_BASE_URL = '/api';

// Configure axios defaults
axios.defaults.timeout = 120000; // 2 minutes for generation requests

interface GenerateSVGResponse {
  success: boolean;
  svg: string;
  metadata: {
    hasTextPrompt: boolean;
    hasImage: boolean;
    timestamp: string;
  };
}

interface IconConcept {
  name: string;
  description: string;
}

interface GeneratedIcon {
  name: string;
  svg: string;
  success: boolean;
  error?: string;
}

interface IconSetResponse {
  success: boolean;
  iconSet: GeneratedIcon[];
  metadata: {
    totalIcons: number;
    successfulIcons: number;
    failedIcons: number;
    timestamp: string;
  };
}

interface SVGAnalysisResponse {
  elements_count: number;
  file_size: number;
  viewbox: string | null;
  has_animations: boolean;
  complexity_score: number;
  suggestions: string[];
}

export async function generateSVG(textPrompt: string, imageFile?: File | null): Promise<GenerateSVGResponse> {
  const formData = new FormData();
  
  if (textPrompt) {
    formData.append('textPrompt', textPrompt);
  }
  
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const response = await axios.post<GenerateSVGResponse>(`${API_BASE_URL}/generate/svg`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw new Error('Failed to generate SVG');
  }
}

export async function generateIconSet(params: {
  stylePrompt: string;
  iconConcepts: IconConcept[];
  referenceIcon?: File | null;
  iconSize?: string;
  strokeWidth?: string;
  colorPalette?: string;
}): Promise<IconSetResponse> {
  const formData = new FormData();
  
  formData.append('stylePrompt', params.stylePrompt);
  formData.append('iconConcepts', JSON.stringify(params.iconConcepts));
  
  if (params.referenceIcon) {
    formData.append('referenceIcon', params.referenceIcon);
  }
  
  if (params.iconSize) {
    formData.append('iconSize', params.iconSize);
  }
  
  if (params.strokeWidth) {
    formData.append('strokeWidth', params.strokeWidth);
  }
  
  if (params.colorPalette) {
    formData.append('colorPalette', params.colorPalette);
  }

  try {
    const response = await axios.post<IconSetResponse>(`${API_BASE_URL}/generate/icon-set`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw new Error('Failed to generate icon set');
  }
}

export async function addIconToSet(params: {
  stylePrompt: string;
  iconConcept: IconConcept;
  referenceIcon?: File | null;
  iconSize?: string;
  strokeWidth?: string;
  colorPalette?: string;
}): Promise<GeneratedIcon> {
  const formData = new FormData();
  
  formData.append('stylePrompt', params.stylePrompt);
  formData.append('iconConcept', JSON.stringify(params.iconConcept));
  
  if (params.referenceIcon) {
    formData.append('referenceIcon', params.referenceIcon);
  }
  
  if (params.iconSize) {
    formData.append('iconSize', params.iconSize);
  }
  
  if (params.strokeWidth) {
    formData.append('strokeWidth', params.strokeWidth);
  }
  
  if (params.colorPalette) {
    formData.append('colorPalette', params.colorPalette);
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/generate/icon-set/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.icon;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw new Error('Failed to add icon to set');
  }
}

// Python backend API calls
const PYTHON_API_BASE_URL = 'http://localhost:8001/api';

export async function analyzeSVG(svgContent: string): Promise<SVGAnalysisResponse> {
  try {
    const response = await axios.post<SVGAnalysisResponse>(`${PYTHON_API_BASE_URL}/svg/analyze`, {
      svg_content: svgContent,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw new Error('Failed to analyze SVG');
  }
}

export async function optimizeSVG(svgContent: string, options: Record<string, unknown> = {}): Promise<{
  optimized_svg: string;
  original_size: number;
  optimized_size: number;
  reduction_percentage: number;
}> {
  try {
    const response = await axios.post(`${PYTHON_API_BASE_URL}/svg/optimize`, {
      svg_content: svgContent,
      options,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw new Error('Failed to optimize SVG');
  }
}

export async function validateSVG(svgContent: string): Promise<{
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}> {
  try {
    const response = await axios.post(`${PYTHON_API_BASE_URL}/svg/validate`, {
      svg_content: svgContent,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw new Error('Failed to validate SVG');
  }
}