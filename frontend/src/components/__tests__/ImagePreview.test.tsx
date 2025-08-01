import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ImagePreview from '../ImagePreview'

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url')
global.URL.revokeObjectURL = vi.fn()

describe('ImagePreview', () => {
  const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })
  const mockOnRemove = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders file information correctly', () => {
    render(<ImagePreview file={mockFile} onRemove={mockOnRemove} />)

    expect(screen.getByText('test.jpg')).toBeInTheDocument()
    expect(screen.getByText(/12 Bytes • image\/jpeg/)).toBeInTheDocument()
  })

  it('renders image preview when URL is available', () => {
    render(<ImagePreview file={mockFile} onRemove={mockOnRemove} />)

    const image = screen.getByAltText('test.jpg')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'mocked-url')
  })

  it('calls onRemove when remove button is clicked', () => {
    render(<ImagePreview file={mockFile} onRemove={mockOnRemove} />)

    const removeButton = screen.getByTitle('Remove image')
    fireEvent.click(removeButton)

    expect(mockOnRemove).toHaveBeenCalledOnce()
  })

  it('creates and revokes object URL', () => {
    const { unmount } = render(<ImagePreview file={mockFile} onRemove={mockOnRemove} />)

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockFile)

    unmount()

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mocked-url')
  })

  it('formats file size correctly for different sizes', () => {
    const largeFile = new File(['x'.repeat(1024)], 'large.jpg', { type: 'image/jpeg' })
    render(<ImagePreview file={largeFile} onRemove={mockOnRemove} />)

    expect(screen.getByText(/1 KB • image\/jpeg/)).toBeInTheDocument()
  })

  it('formats file size correctly for very large files', () => {
    const megaFile = new File(['x'.repeat(1024 * 1024)], 'mega.jpg', { type: 'image/jpeg' })
    render(<ImagePreview file={megaFile} onRemove={mockOnRemove} />)

    expect(screen.getByText(/1 MB • image\/jpeg/)).toBeInTheDocument()
  })

  it('handles zero-byte files', () => {
    const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' })
    render(<ImagePreview file={emptyFile} onRemove={mockOnRemove} />)

    expect(screen.getByText(/0 Bytes • image\/jpeg/)).toBeInTheDocument()
  })
})