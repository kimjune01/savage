import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { generateSVG, analyzeSVG, validateSVG, verifyGeneration } from '../api'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateSVG', () => {
    it('sends correct request with text prompt only', async () => {
      const mockResponse = {
        data: {
          success: true,
          svg: '<svg>test</svg>',
          metadata: {
            hasTextPrompt: true,
            hasImage: false,
            timestamp: '2023-01-01T00:00:00.000Z'
          }
        }
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await generateSVG('test prompt')

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/generate/svg',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      expect(result).toEqual(mockResponse.data)
    })

    it('sends correct request with text prompt and image', async () => {
      const mockResponse = {
        data: {
          success: true,
          svg: '<svg>test</svg>',
          metadata: {
            hasTextPrompt: true,
            hasImage: true,
            timestamp: '2023-01-01T00:00:00.000Z'
          }
        }
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
      const result = await generateSVG('test prompt', mockFile)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/generate/svg',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      expect(result).toEqual(mockResponse.data)
    })

    it('handles API errors correctly', async () => {
      const errorResponse = {
        isAxiosError: true,
        response: {
          data: { error: 'Invalid input' }
        }
      }

      mockedAxios.isAxiosError = vi.fn().mockReturnValue(true)
      mockedAxios.post.mockRejectedValue(errorResponse)

      await expect(generateSVG('test')).rejects.toThrow('Invalid input')
    })

    it('handles network errors correctly', async () => {
      mockedAxios.isAxiosError = vi.fn().mockReturnValue(false)
      mockedAxios.post.mockRejectedValue(new Error('Network error'))

      await expect(generateSVG('test')).rejects.toThrow('Failed to generate SVG')
    })
  })

  describe('analyzeSVG', () => {
    it('sends correct request for SVG analysis', async () => {
      const mockResponse = {
        data: {
          elements_count: 5,
          file_size: 1024,
          viewbox: '0 0 100 100',
          has_animations: false,
          complexity_score: 50.5,
          suggestions: ['Use fewer elements']
        }
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await analyzeSVG('<svg>test</svg>')

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/svg/analyze',
        { svg_content: '<svg>test</svg>' }
      )

      expect(result).toEqual(mockResponse.data)
    })

    it('handles analysis errors correctly', async () => {
      const errorResponse = {
        isAxiosError: true,
        response: {
          data: { error: 'Invalid SVG content' }
        }
      }

      mockedAxios.isAxiosError = vi.fn().mockReturnValue(true)
      mockedAxios.post.mockRejectedValue(errorResponse)

      await expect(analyzeSVG('<invalid-svg>')).rejects.toThrow('Invalid SVG content')
    })
  })

  describe('validateSVG', () => {
    it('sends correct request for SVG validation', async () => {
      const mockResponse = {
        data: {
          is_valid: true,
          errors: [],
          warnings: ['Missing viewBox'],
          suggestions: ['Add viewBox for better scalability']
        }
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await validateSVG('<svg>test</svg>')

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/svg/validate',
        { svg_content: '<svg>test</svg>' }
      )

      expect(result).toEqual(mockResponse.data)
    })

    it('handles validation errors correctly', async () => {
      const errorResponse = {
        isAxiosError: true,
        response: {
          data: { error: 'Validation failed' }
        }
      }

      mockedAxios.isAxiosError = vi.fn().mockReturnValue(true)
      mockedAxios.post.mockRejectedValue(errorResponse)

      await expect(validateSVG('<invalid>')).rejects.toThrow('Validation failed')
    })
  })

  describe('verifyGeneration', () => {
    it('sends correct request for image verification', async () => {
      const mockResponse = {
        data: {
          message: 'Image verified successfully'
        }
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
      const result = await verifyGeneration(mockFile)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/verify-generation',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      expect(result).toEqual(mockResponse.data)
    })

    it('handles verification errors correctly', async () => {
      const errorResponse = {
        isAxiosError: true,
        response: {
          data: { error: 'Image verification failed' }
        }
      }

      mockedAxios.isAxiosError = vi.fn().mockReturnValue(true)
      mockedAxios.post.mockRejectedValue(errorResponse)

      const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
      await expect(verifyGeneration(mockFile)).rejects.toThrow('Image verification failed')
    })
  })
})