export function WhyReactSection() {
  const tableData = [
    { fitur: 'Kecepatan load', wordpress: '4-8 detik', awd: '< 1 detik ⚡' },
    { fitur: 'Lighthouse score', wordpress: '30-60', awd: '90-100 ✅' },
    { fitur: 'Plugin berbayar', wordpress: 'Ya (Rp 500rb-2jt/tahun)', awd: 'Tidak ada ❌' },
    { fitur: 'Template', wordpress: 'Sama dengan ribuan web lain', awd: 'Custom unik ✅' },
    { fitur: 'Admin panel', wordpress: 'Plugin WooCommerce', awd: 'Milik sendiri selamanya ✅' },
    { fitur: 'SEO', wordpress: 'Lemah', awd: 'Kuat (SSR/SSG) ✅' },
    { fitur: 'Keamanan', wordpress: 'Rawan hack via plugin', awd: 'Lebih aman ✅' },
    { fitur: 'Biaya tahunan', wordpress: 'Hosting+plugin+domain = mahal', awd: 'Vercel gratis ✅' },
  ];

  const cellStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    lineHeight: 1.4,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    verticalAlign: 'middle',
  };

  const headerCellStyle: React.CSSProperties = {
    ...cellStyle,
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  };

  return (
    <section id="why-react" style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      <div
        className="px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: 1100, margin: '0 auto', width: '100%', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              color: '#FAFAFA',
              letterSpacing: '-0.02em',
              marginBottom: 12,
            }}
          >
            Kenapa Website React Lebih Baik?
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 16,
              color: 'rgba(255,255,255,0.55)',
              margin: 0,
              maxWidth: 500,
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.6,
            }}
          >
            Bukan soal teknologi — soal hasil untuk bisnis kamu
          </p>
        </div>

        {/* Table */}
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: 48,
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>FITUR</th>
                <th style={headerCellStyle}>WordPress</th>
                <th style={{ ...headerCellStyle, color: '#C6FF4A' }}>AWD (React/Next.js)</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...cellStyle, fontWeight: 600, color: '#FAFAFA' }}>{row.fitur}</td>
                  <td style={{ ...cellStyle, color: 'rgba(255,255,255,0.45)' }}>{row.wordpress}</td>
                  <td style={{ ...cellStyle, color: '#C6FF4A' }}>{row.awd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA Card */}
        <div
          style={{
            background: 'rgba(14,18,10,0.78)',
            border: '1px solid rgba(198,255,74,0.2)',
            borderRadius: 20,
            padding: '40px 32px',
            textAlign: 'center',
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          <h3
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'clamp(20px, 3vw, 26px)',
              fontWeight: 700,
              color: '#FAFAFA',
              margin: '0 0 20px',
              letterSpacing: '-0.01em',
            }}
          >
            Website kamu sekarang dapat nilai berapa?
          </h3>
          <button
            onClick={() => document.getElementById('speed-scan')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#C6FF4A',
              color: '#07080A',
              borderRadius: 999,
              padding: '14px 32px',
              fontSize: 15,
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 40px rgba(198,255,74,0.2)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.filter = 'brightness(1.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            Cek Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}
