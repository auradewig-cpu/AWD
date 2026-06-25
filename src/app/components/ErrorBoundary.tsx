import { Component, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#fafafa',
          fontFamily: 'sans-serif',
          gap: 16,
          padding: 32,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48 }}>⚠</div>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
            Terjadi kesalahan
          </h2>
          <p style={{ color: '#888', fontSize: 14, margin: 0, maxWidth: 400 }}>
            Halaman mengalami error. Coba refresh browser.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8,
              padding: '10px 24px',
              background: '#C6FF4A',
              color: '#000',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Refresh Halaman
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre style={{
              marginTop: 16, padding: 16,
              background: '#1a1a1a', borderRadius: 8,
              fontSize: 11, color: '#ff6b6b',
              textAlign: 'left', maxWidth: 600,
              overflow: 'auto', maxHeight: 200,
            }}>
              {this.state.error.message}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
