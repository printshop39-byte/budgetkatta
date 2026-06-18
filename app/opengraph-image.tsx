import { ImageResponse } from 'next/og';

// Default OpenGraph/Twitter card image for the whole site, generated at build
// time with next/og (no binary asset needed). Per-page metadata can override.
export const runtime = 'nodejs';
export const alt = 'BudgetKatta — स्मार्ट आर्थिक मार्गदर्शक';
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
          <span style={{ fontSize: 72, marginRight: 16 }}>💰</span>
          <span>
            Budget<span style={{ color: '#fbbf24' }}>Katta</span>
          </span>
        </div>
        <div style={{ marginTop: 28, fontSize: 40, fontWeight: 700, color: '#fbbf24', lineHeight: 1.3 }}>
          Smart Financial Guide for Maharashtra
        </div>
        <div style={{ marginTop: 16, fontSize: 30, color: '#94a3b8', lineHeight: 1.4 }}>
          FD Rates • Loans • SIP • Insurance • Bank Directory
        </div>
      </div>
    ),
    { ...size },
  );
}
