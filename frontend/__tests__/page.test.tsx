import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Savage')
  })

  it('renders the description', () => {
    render(<Home />)
    
    const description = screen.getByText('AI-Powered SVG Generator')
    expect(description).toBeInTheDocument()
  })
})