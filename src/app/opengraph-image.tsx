import { ImageResponse } from 'next/og';

export const alt = 'Chancellor — Project Management & CRM Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#FFFFFF',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 40px 0', paddingRight: '30px' }}>
          {/* Custom Roadmap/Pipeline SVG */}
          <svg width="250" height="250" viewBox="0 0 512 512" fill="none">
            {/* Top Bar */}
            <rect x="90" y="140" width="210" height="64" rx="32" fill="#8C9EFF" style={{ filter: 'drop-shadow(10px 8px 15px rgba(34,27,106,0.15))' }}/>
            <circle cx="122" cy="172" r="14" fill="#FFFFFF"/>
            
            {/* Middle Bar */}
            <rect x="150" y="224" width="260" height="64" rx="32" fill="#5560FF" style={{ filter: 'drop-shadow(10px 8px 15px rgba(34,27,106,0.2))' }}/>
            <circle cx="182" cy="256" r="14" fill="#FFFFFF"/>
            
            {/* Bottom Bar */}
            <rect x="230" y="308" width="190" height="64" rx="32" fill="#3A25A3" style={{ filter: 'drop-shadow(10px 8px 15px rgba(34,27,106,0.25))' }}/>
            <circle cx="262" cy="340" r="14" fill="#FFFFFF"/>
          </svg>
          
          <h1 style={{ fontSize: 130, color: '#0a0a0e', fontWeight: 800, margin: '0 0 0 20px', letterSpacing: '-4px' }}>
            Chancellor
          </h1>
        </div>
        <p style={{ fontSize: 40, color: '#676879', margin: 0, letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700 }}>
          Project Management & CRM Platform
        </p>
      </div>
    ),
    { ...size }
  );
}
