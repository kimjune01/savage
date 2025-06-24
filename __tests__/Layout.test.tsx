import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from '../Layout'

describe('Layout', () => {
  it('renders navigation with correct links', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    )

    expect(screen.getByText('Savage SVG')).toBeInTheDocument()
    expect(screen.getByText('Generate')).toBeInTheDocument()
    expect(screen.getByText('Icon Set')).toBeInTheDocument()
    expect(screen.getByText('Analyze')).toBeInTheDocument()
  })

  it('has correct navigation links', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    )

    const generateLink = screen.getByRole('link', { name: /generate/i })
    const iconSetLink = screen.getByRole('link', { name: /icon set/i })
    const analyzeLink = screen.getByRole('link', { name: /analyze/i })

    expect(generateLink).toHaveAttribute('href', '/')
    expect(iconSetLink).toHaveAttribute('href', '/icon-set')
    expect(analyzeLink).toHaveAttribute('href', '/analyze')
  })
})