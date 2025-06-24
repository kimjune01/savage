import axios from 'axios'

// API endpoints
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : ''

export interface GenerateSVGResponse {
  success: boolean
  svg: string
  metadata: {
    hasTextPrompt: boolean
    hasImage: boolean
    timestamp: string
  }
}

export interface AnalyzeSVGResponse {
  elements_count: number
  file_size: number
  viewbox: string
  has_animations: boolean
  complexity_score: number
  suggestions: string[]
}

export interface ValidateSVGResponse {
  is_valid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

/**
 * Generate SVG from text prompt and optional image
 */
export async function generateSVG(
  textPrompt: string,
  imageFile?: File
): Promise<GenerateSVGResponse> {
  try {
    const formData = new FormData()
    formData.append('textPrompt', textPrompt)
    
    if (imageFile) {
      formData.append('image', imageFile)
    }

    const response = await axios.post(`${API_BASE_URL}/api/generate/svg`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to generate SVG')
    }
    throw new Error('Failed to generate SVG')
  }
}

/**
 * Analyze SVG content for complexity and optimization suggestions
 */
export async function analyzeSVG(svgContent: string): Promise<AnalyzeSVGResponse> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/svg/analyze`, {
      svg_content: svgContent,
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to analyze SVG')
    }
    throw new Error('Failed to analyze SVG')
  }
}

/**
 * Validate SVG content for errors and warnings
 */
export async function validateSVG(svgContent: string): Promise<ValidateSVGResponse> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/svg/validate`, {
      svg_content: svgContent,
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to validate SVG')
    }
    throw new Error('Failed to validate SVG')
  }
}

/**
 * Verify generation request with image analysis
 */
export async function verifyGeneration(imageFile: File): Promise<{ message: string }> {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await axios.post(`${API_BASE_URL}/api/verify-generation`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to verify generation')
    }
    throw new Error('Failed to verify generation')
  }
}