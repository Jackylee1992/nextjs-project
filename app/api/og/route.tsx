import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Get dynamic parameters from URL query
  const title = searchParams.get('title') || '本地 HTML 项目';
  const description = searchParams.get('description') || '这是一个本地 HTML 项目';
  const bgImage = searchParams.get('bg') || 'https://cdn.miraimindcdn.ai/image/0E/B1/0EB19BAE-B54C-4B05-A600-0FE7ECAFAFBA20260323_L.jpg';
  
  // Support for wide Twitter cards (1200x675 for 16:9 or 1200x630 for standard OG)
  const width = parseInt(searchParams.get('width') || '1200');
  const height = parseInt(searchParams.get('height') || '630');

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: 'white',
          background: 'linear-gradient(to bottom right, #1a1a2e, #16213e)',
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
        {/* Background image overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.3,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
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
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 32,
              opacity: 0.9,
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
}
