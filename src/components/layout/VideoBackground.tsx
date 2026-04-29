'use client';

interface VideoBackgroundProps {
  src: string;
  overlayOpacity?: number;
}

export default function VideoBackground({ src, overlayOpacity = 0.6 }: VideoBackgroundProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden'
    }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `rgba(255, 255, 255, ${overlayOpacity})`,
        backdropFilter: 'blur(10px)'
      }} />
    </div>
  );
}
