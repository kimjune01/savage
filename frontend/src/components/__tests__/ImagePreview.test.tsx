import { describe, it, expect, vi } from 'vitest'
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
})