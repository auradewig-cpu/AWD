import { useState } from 'react';

const WA_NUMBER = '6285286427559';

interface ScanResult {
  score: number;
  fcp: string;
  lcp: string;
  cls: string;
}

export function SpeedScanSection() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);

  async function handleScan() {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const encodedUrl = encodeURIComponent(url.trim());
      const res = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&strategy=mobile`
      );

      if (!res.ok) {
        setError(prev => prev);
        throw new Error('API request failed');
      }

      const data = await res.json();

      if (!data.lighthouseResult) {
        setError('URL tidak valid atau website tidak bisa diakses.');
        return;
      }

      const perf = data.lighthouseResult.categories.performance;
      const audits = data.lighthouseResult.audits;
      const fcpAudit = audits['first-contentful-paint'];
      const lcpAudit = audits['largest-contentful-paint'];
      const clsAudit = audits['cumulative-layout-shift'];

      setResult({
        score: Math.round(perf.score * 100),
        fcp: fcpAudit?.displayValue || '-',
        lcp: lcpAudit?.displayValue || '-',
        cls: clsAudit?.displayValue || clsAudit?.numericValue?.toFixed(3) || '-',
      });
    } catch {
      setError('URL tidak valid atau website tidak bisa diakses.');
    } finally {
      setLoading(false);
    }
  }

  function getScoreColor(score: number) {
    if (score < 70) return '#ff6b6b';
    if (score < 90) return '#ffd147';
    return '#C6FF4A';
  }

  function getScoreLabel(score: number) {
    if (score < 70) return 'Perlu Perbaikan';
    if (score < 90) return 'Cukup Baik';
    return 'Excellent!';
  }

  const score = result?.score ?? 0;

  return (
    <section id="speed-scan" style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      <div
        className="px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: 900, margin: '0 auto', width: '100%', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
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
            Website Kamu Dapat Nilai Berapa?
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
            Cek kecepatan website kamu vs standar AWD. Gratis, instant.
          </p>
        </div>

        {/* Input */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            maxWidth: 600,
            margin: '0 auto',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <input
            type="url"
            placeholder="https://websitekamu.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            style={{
              flex: 1,
              minWidth: 240,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: '14px 18px',
              color: '#FAFAFA',
              fontSize: 15,
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleScan}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#C6FF4A',
              color: '#07080A',
              borderRadius: 12,
              padding: '14px 28px',
              fontSize: 15,
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Memindai...' : 'Scan Sekarang'}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: '3px solid rgba(198,255,74,0.15)',
                borderTopColor: '#C6FF4A',
                borderRadius: '50%',
                animation: 'speed-scan-spin 0.8s linear infinite',
                margin: '0 auto 16px',
              }}
            />
            <style>{`@keyframes speed-scan-spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>
              Sedang menganalisis...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              textAlign: 'center',
              marginTop: 48,
              padding: 24,
              background: 'rgba(255,107,107,0.08)',
              border: '1px solid rgba(255,107,107,0.2)',
              borderRadius: 16,
            }}
          >
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#ff6b6b', margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div style={{ marginTop: 48 }}>
            {/* Score cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 20,
                maxWidth: 600,
                margin: '0 auto',
              }}
              className="max-sm:grid-cols-1"
            >
              {/* Your score */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${getScoreColor(score)}33`,
                  borderRadius: 20,
                  padding: 28,
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.45)',
                    fontWeight: 600,
                    margin: '0 0 16px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Website Kamu
                </p>
                <div
                  style={{
                    fontSize: 52,
                    fontWeight: 800,
                    fontFamily: 'Inter Tight, sans-serif',
                    color: getScoreColor(score),
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {score}
                </div>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12,
                    color: getScoreColor(score),
                    fontWeight: 600,
                    background: `${getScoreColor(score)}15`,
                    borderRadius: 999,
                    padding: '4px 12px',
                  }}
                >
                  {getScoreLabel(score)}
                </span>
              </div>

              {/* AWD standard */}
              <div
                style={{
                  background: 'rgba(198,255,74,0.05)',
                  border: '1px solid rgba(198,255,74,0.2)',
                  borderRadius: 20,
                  padding: 28,
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13,
                    color: 'rgba(198,255,74,0.6)',
                    fontWeight: 600,
                    margin: '0 0 16px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Standar AWD
                </p>
                <div
                  style={{
                    fontSize: 52,
                    fontWeight: 800,
                    fontFamily: 'Inter Tight, sans-serif',
                    color: '#C6FF4A',
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  95
                </div>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12,
                    color: '#C6FF4A',
                    fontWeight: 600,
                    background: 'rgba(198,255,74,0.15)',
                    borderRadius: 999,
                    padding: '4px 12px',
                  }}
                >
                  Excellent!
                </span>
              </div>
            </div>

            {/* Metrics table */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                maxWidth: 600,
                margin: '24px auto 0',
              }}
              className="max-sm:grid-cols-1"
            >
              <MetricBox label="FCP" value={result.fcp} />
              <MetricBox label="LCP" value={result.lcp} />
              <MetricBox label="CLS" value={result.cls} />
            </div>

            {/* Conditional message */}
            <div style={{ textAlign: 'center', marginTop: 36 }}>
              {score < 70 && (
                <div>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 16,
                      color: '#ff6b6b',
                      fontWeight: 600,
                      margin: '0 0 16px',
                    }}
                  >
                    Website kamu perlu diperbaiki. Hubungi AWD sekarang.
                  </p>
                  <WhatsAppButton message="Halo Aldi, saya cek website saya di AWD Speed Scan dan dapat skor rendah. Saya ingin konsultasi perbaikan website." />
                </div>
              )}
              {score >= 70 && score < 90 && (
                <div>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 16,
                      color: '#ffd147',
                      fontWeight: 600,
                      margin: '0 0 16px',
                    }}
                  >
                    Lumayan, tapi bisa lebih baik. AWD bisa tingkatkan ke 90+.
                  </p>
                  <WhatsAppButton message="Halo Aldi, saya cek website saya di AWD Speed Scan. Saya ingin upgrade website agar skornya 90+." />
                </div>
              )}
              {score >= 90 && (
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 16,
                    color: '#C6FF4A',
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Website kamu sudah bagus! Tapi kalau mau bikin yang baru, AWD siap.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        padding: '16px 20px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          color: 'rgba(255,255,255,0.35)',
          fontWeight: 600,
          margin: '0 0 6px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 18,
          color: '#FAFAFA',
          fontWeight: 700,
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function WhatsAppButton({ message }: { message: string }) {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: '#C6FF4A',
        color: '#07080A',
        borderRadius: 999,
        padding: '12px 24px',
        fontSize: 15,
        fontWeight: 700,
        fontFamily: 'Inter, sans-serif',
        textDecoration: 'none',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.filter = 'brightness(1.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.filter = 'brightness(1)';
      }}
    >
      Konsultasi via WhatsApp →
    </a>
  );
}
