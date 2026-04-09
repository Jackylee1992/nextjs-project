import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get dynamic parameters from URL query
    const title = searchParams.get('title') || '本地 HTML 项目';
    const description = searchParams.get('description') || '这是一个本地 HTML 项目';
    const bgImage = searchParams.get('bg') || 'https://cdn.miraimindcdn.ai/image/0E/B1/0EB19BAE-B54C-4B05-A600-0FE7ECAFAFBA20260323_L.jpg';
    
    // Validate background URL (prevent XSS)
    if (bgImage && !bgImage.match(/^https?:\/\//)) {
      return new Response('Invalid background URL - must be http/https', { status: 400 });
    }
    
    // Parse and validate dimensions
    const width = parseInt(searchParams.get('width') || '1200');
    const height = parseInt(searchParams.get('height') || '630');
    
    if (isNaN(width) || isNaN(height) || width < 100 || width > 2000 || height < 100 || height > 2000) {
      return new Response('Invalid dimensions - width/height must be between 100 and 2000', { status: 400 });
    }

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            color: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background image using <img> tag (Satori doesn't support backgroundImage) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            alt="bg"
          />
          
          {/* Light gradient overlay for text readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom right, rgba(26, 26, 46, 0.3), rgba(22, 33, 62, 0.4))',
            }}
          />
          
          {/* Content - placed after overlay so it appears on top (Satori uses DOM order, not z-index) */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 60px',
            }}
          >
            <h1
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                marginBottom: 20,
                lineHeight: 1.2,
                maxWidth: '900px',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 32,
                opacity: 0.95,
                maxWidth: '800px',
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>
          </div>
        </div>
      ),
      {
        width,
        height,
      },
    );
    
    // Add cache headers
    imageResponse.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
    
    return imageResponse;
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
