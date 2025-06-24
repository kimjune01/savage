import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { generateSVG, analyzeSVG, validateSVG } from '../api'

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
        'http://localhost:8001/api/svg/analyze',
        { svg_content: '<svg>test</svg>' }
      )

      expect(result).toEqual(mockResponse.data)
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
        'http://localhost:8001/api/svg/validate',
        { svg_content: '<svg>test</svg>' }
      )

      expect(result).toEqual(mockResponse.data)
    })
  })
})