import { ImageResponse } from 'next/og';

// Default OpenGraph/Twitter card image for the whole site, generated with
// next/og (no binary asset needed). Per-page metadata can override.
//
// runtime = 'edge': next/og is designed for the edge runtime, which loads its
// wasm/font assets without Node's fileURLToPath(). The nodejs runtime broke the
// build on Windows paths containing a space (fileURLToPath → "Invalid URL");
// edge is the canonical runtime for OG generation and behaves identically on
// Linux/Vercel. No Node-only APIs are used here, so the switch is safe.
export const runtime = 'edge';
export const alt = 'BudgetKatta — Home Loan, Property Budget & Home Insurance';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0A1128 0%, #050814 100%)',
          color: '#e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 64, fontWeight: 800 }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 84,
              height: 84,
              marginRight: 20,
              borderRadius: 24,
              background: '#fbbf24',
              color: '#0A1128',
              fontSize: 56,
            }}
          >
            ₹
          </span>
          <span>
            Budget<span style={{ color: '#fbbf24' }}>Katta</span>
          </span>
        </div>
        <div style={{ marginTop: 28, fontSize: 40, fontWeight: 700, color: '#fbbf24', lineHeight: 1.3 }}>
          Home Loan, Property Budget &amp; Home Insurance
        </div>
        <div style={{ marginTop: 16, fontSize: 30, color: '#94a3b8', lineHeight: 1.4 }}>
          EMI • Down-payment • Balance transfer • Maharashtra
        </div>
      </div>
    ),
    { ...size },
  );
}
