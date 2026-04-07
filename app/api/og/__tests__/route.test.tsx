import { GET } from '../route';
import type { ReactElement } from 'react';
import type { NextRequest } from 'next/server';

// Mock next/og
jest.mock('next/og', () => ({
  ImageResponse: jest.fn(),
}));

const { ImageResponse } = jest.requireMock('next/og') as { ImageResponse: jest.Mock };

interface MockResponse {
  content: ReactElement;
  options: { width: number; height: number };
  headers: Map<string, string>;
  set: (key: string, value: string) => MockResponse;
  get: (key: string) => string | undefined;
}

// 保存生成的图片
let lastGeneratedImage: Buffer | null = null;

beforeAll(() => {
  ImageResponse.mockImplementation((content: ReactElement, options: { width: number; height: number }) => {
    // 创建一个简单的 mock 图片数据
    const mockImageBuffer = Buffer.from('mock-image-data');
    lastGeneratedImage = mockImageBuffer;
    
    const mockResponse: MockResponse = {
      content,
      options,
      headers: new Map(),
      set: function(key: string, value: string) {
        this.headers.set(key, value);
        return this;
      },
      get: function(key: string) {
        return this.headers.get(key);
      },
    };
    return mockResponse;
  });
});

// 导出函数以便测试中可以获取生成的图片
export function getLastGeneratedImage(): Buffer | null {
  return lastGeneratedImage;
}

// Create a mock NextRequest
const createMockRequest = (url: string): NextRequest => {
  return {
    url,
    nextUrl: {
      searchParams: new URL(url).searchParams,
    },
  } as unknown as NextRequest;
};

describe('OG Image API', () => {
  beforeEach(() => {
    ImageResponse.mockClear();
    lastGeneratedImage = null;
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
    
    // 验证图片已生成
    expect(lastGeneratedImage).not.toBeNull();
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