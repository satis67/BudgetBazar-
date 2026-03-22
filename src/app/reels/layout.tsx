export default function ReelsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: '#000' }}>
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 1200 }}>
        <a href="/" style={{ 
          background: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(10px)',
          padding: '0.5rem 1rem',
          borderRadius: '2rem',
          color: '#fff',
          fontWeight: 600,
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          ← Back
        </a>
      </div>
      {children}
    </div>
  );
}
