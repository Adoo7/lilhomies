
export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'var(--background)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '4rem', lineHeight: 1, marginBottom: '0.5rem' }}>🏠</div>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem',
        }}>
          Lil Homies
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>الموقع الرسمي للهوميز الصغار</p>
        <p style={{ color: 'var(--muted)', marginTop: '0.4rem', fontSize: '0.9rem' }}>احنه نلعب فور فن مو حق نستانس</p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '700px', width: '100%' }}>
        <a href="/burns" style={{
          flex: '1 1 200px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '2rem',
          textDecoration: 'none',
          color: 'var(--foreground)',
          textAlign: 'center',
          display: 'block',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔥</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f97316' }}>التحريقات</h2>
          <p style={{ color: 'var(--muted)', marginTop: '0.4rem', fontSize: '0.85rem' }}>شوف التحريقات الحلوة</p>
        </a>
      </div>

      <p style={{ color: 'var(--border)', marginTop: '4rem', fontSize: '0.8rem' }}>© 2025 Lil Homies</p>
    </main>
  );
}
