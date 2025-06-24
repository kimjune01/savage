import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Layout from '../Layout'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

describe('Layout', () => {
  it('renders navigation with correct links', () => {
    render(<Layout />)

    expect(screen.getByText('Savage SVG')).toBeInTheDocument()
    expect(screen.getByText('Generate')).toBeInTheDocument()
    expect(screen.getByText('Icon Set')).toBeInTheDocument()
    expect(screen.getByText('Analyze')).toBeInTheDocument()
  })

  it('has correct navigation links', () => {
    render(<Layout />)

    const generateLink = screen.getByRole('link', { name: /generate/i })
    const iconSetLink = screen.getByRole('link', { name: /icon set/i })
    const analyzeLink = screen.getByRole('link', { name: /analyze/i })

    expect(generateLink).toHaveAttribute('href', '/')
    expect(iconSetLink).toHaveAttribute('href', '/icon-set')
    expect(analyzeLink).toHaveAttribute('href', '/analyze')
  })

  it('renders the Savage SVG brand link', () => {
    render(<Layout />)

    const brandLink = screen.getByRole('link', { name: /savage svg/i })
    expect(brandLink).toHaveAttribute('href', '/')
  })

  it('renders children when provided', () => {
    render(
      <Layout>
        <div data-testid="child-content">Test Content</div>
      </Layout>
    )

    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies active state to current path', async () => {
    const { usePathname } = await import('next/navigation')
    vi.mocked(usePathname).mockReturnValue('/icon-set')

    render(<Layout />)

    const iconSetLink = screen.getByRole('link', { name: /icon set/i })
    expect(iconSetLink).toHaveClass('text-blue-600')
  })
})