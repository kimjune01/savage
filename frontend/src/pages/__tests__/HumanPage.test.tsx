import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';
import HumanPage from '../HumanPage';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('HumanPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock fetch for all tests
    global.fetch = vi.fn(() =>
      Promise.resolve({
        blob: () => Promise.resolve(new Blob(['fake-image'], { type: 'image/png' })),
      })
    ) as jest.Mock;
  });

  it('should render the hardcoded image and prompt', () => {
    render(<HumanPage />);
    
    expect(screen.getByText(/Analyze this image and describe what you see/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Reference image/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Analysis/ })).toBeInTheDocument();
  });

  it('should display jk.png image with correct src', () => {
    render(<HumanPage />);
    
    const image = screen.getByRole('img', { name: /Reference image/ });
    expect(image).toHaveAttribute('src', '/jk.png');
  });

  it('should show loading state when Generate Analysis is clicked', async () => {
    mockedAxios.post.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<HumanPage />);
    
    const button = screen.getByRole('button', { name: /Generate Analysis/ });
    fireEvent.click(button);
    
    expect(screen.getByText(/Analyzing image.../)).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('should display analysis results on successful API call', async () => {
    const mockResponse = {
      data: {
        success: true,
        analysis: 'I can see a person with dark hair and a friendly expression.',
        timestamp: '2024-06-24T02:30:00Z'
      }
    };
    
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    render(<HumanPage />);
    
    const button = screen.getByRole('button', { name: /Generate Analysis/ });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/I can see a person with dark hair and a friendly expression./)).toBeInTheDocument();
    });
    
    expect(button).not.toBeDisabled();
    expect(screen.queryByText(/Analyzing image.../)).not.toBeInTheDocument();
  });

  it('should display error message on API failure', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Network error'));
    
    render(<HumanPage />);
    
    const button = screen.getByRole('button', { name: /Generate Analysis/ });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/API verification failed/)).toBeInTheDocument();
    });
    
    expect(screen.getByRole('button', { name: /Retry/ })).toBeInTheDocument();
  });

  it('should handle API error response correctly', async () => {
    const mockErrorResponse = {
      data: {
        success: false,
        error: 'OpenAI API Error',
        timestamp: '2024-06-24T02:30:00Z'
      }
    };
    
    mockedAxios.post.mockResolvedValue(mockErrorResponse);
    
    render(<HumanPage />);
    
    const button = screen.getByRole('button', { name: /Generate Analysis/ });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/OpenAI API Error/)).toBeInTheDocument();
    });
    
    expect(screen.getByRole('button', { name: /Retry/ })).toBeInTheDocument();
  });

  it('should retry analysis when Retry button is clicked', async () => {
    mockedAxios.post
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        data: {
          success: true,
          analysis: 'Successful retry analysis',
          timestamp: '2024-06-24T02:30:00Z'
        }
      });
    
    render(<HumanPage />);
    
    // First attempt fails
    const generateButton = screen.getByRole('button', { name: /Generate Analysis/ });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/API verification failed/)).toBeInTheDocument();
    });
    
    // Retry succeeds
    const retryButton = screen.getByRole('button', { name: /Retry/ });
    fireEvent.click(retryButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Successful retry analysis/)).toBeInTheDocument();
    });
    
    expect(screen.queryByText(/API verification failed/)).not.toBeInTheDocument();
  });

  it('should call correct API endpoint with POST method and FormData', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        success: true,
        analysis: 'Test analysis',
        timestamp: '2024-06-24T02:30:00Z'
      }
    });
    
    render(<HumanPage />);
    
    const button = screen.getByRole('button', { name: /Generate Analysis/ });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/verify-generation',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
    });
  });
});