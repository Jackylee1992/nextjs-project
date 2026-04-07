import { GET } from '../route';

// Mock next/og
jest.mock('next/og', () => ({
  ImageResponse: jest.fn(),
}));

const { ImageResponse } = require('next/og');

ImageResponse.mockImplementation((content: any, options: any) => {
  const mockResponse = {
    content,
    options,
    headers: new Map(),
    set: jest.fn(function(this: any, key: string, value: string) {
      this.headers.set(key, value);
      return this;
    }),
    get: jest.fn(function(this: any, key: string) {
      return this.headers.get(key);
    }),
  } as any;
  return mockResponse;
});

// Create a mock NextRequest
const createMockRequest = (url: string) => ({
  url,
  nextUrl: {
    searchParams: new URL(url).searchParams,
  },
} as any);

describe('OG Image API', () => {
  beforeEach(() => {
    ImageResponse.mockClear();
  });

  const createRequest = (params: Record<string, string> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `http://localhost:3000/api/og${queryString ? `?${queryString}` : ''}`;
    return createMockRequest(url);
  };

  it('should return 400 for invalid background URL', async () => {
    const request = createRequest({ bg: 'javascript:alert(1)' });
    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Invalid background URL - must be http/https');
  });

  it('should return 400 for invalid dimensions', async () => {
    const request = createRequest({ width: 'abc' });
    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Invalid dimensions - width/height must be between 100 and 2000');
  });

  it('should return 400 for dimensions out of range', async () => {
    const request = createRequest({ width: '50' });
    const response = await GET(request);

    expect(response.status).toBe(400);
  });

  it('should generate image with default values', async () => {
    const request = createRequest();
    
    await GET(request);

    expect(ImageResponse).toHaveBeenCalled();
    const callArgs = ImageResponse.mock.calls[0];
    expect(callArgs[1]).toEqual({ width: 1200, height: 630 });
  });

  it('should generate image with custom values', async () => {
    const request = createRequest({
      title: 'Custom Title',
      description: 'Custom Description',
      width: '1200',
      height: '675',
      bg: 'https://example.com/image.jpg',
    });
    
    await GET(request);

    expect(ImageResponse).toHaveBeenCalled();
    const callArgs = ImageResponse.mock.calls[0];
    expect(callArgs[1]).toEqual({ width: 1200, height: 675 });
  });

  it('should accept https background URL', async () => {
    const request = createRequest({ bg: 'https://example.com/image.png' });
    
    await GET(request);

    expect(ImageResponse).toHaveBeenCalled();
  });

  it('should accept http background URL', async () => {
    const request = createRequest({ bg: 'http://example.com/image.png' });
    
    await GET(request);

    expect(ImageResponse).toHaveBeenCalled();
  });
});