import React from 'react';

export default function NusaMipaLogo({ 
  height = 36, 
  showSubtitle = true, 
  variant = 'dark', // 'dark' (for light backgrounds) or 'light' (for dark backgrounds)
  className = '' 
}) {
  const nusaColor = variant === 'light' ? '#FFFFFF' : '#0F172A';
  const subtitleColor = variant === 'light' ? '#A1A1AA' : '#64748B';

  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ height: `${height}px` }}>
      <svg 
        viewBox="0 0 540 120" 
        height={height} 
        style={{ width: 'auto', height: '100%', overflow: 'visible' }} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="nusaPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <linearGradient id="mipaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>

        {/* ================= NUSA (Spatio-Network Typography) ================= */}
        {/* N */}
        <g id="letter-N">
          <path d="M 28 32 L 28 88" stroke={nusaColor} strokeWidth="12" strokeLinecap="round" />
          <path d="M 30 36 L 70 84" stroke={nusaColor} strokeWidth="11" strokeLinecap="round" />
          <path d="M 72 32 L 72 88" stroke={nusaColor} strokeWidth="12" strokeLinecap="round" />
          {/* Spatial Coordinates Dots */}
          <circle cx="28" cy="32" r="4.5" fill="#2563EB" />
          <circle cx="72" cy="88" r="4.5" fill="#2563EB" />
        </g>

        {/* U */}
        <g id="letter-U">
          <path d="M 98 32 L 98 68 C 98 84 134 84 134 68 L 134 32" stroke={nusaColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* S */}
        <g id="letter-S">
          <path d="M 194 42 C 194 32 160 30 160 45 C 160 62 196 58 196 75 C 196 90 160 90 158 78" stroke={nusaColor} strokeWidth="12" strokeLinecap="round" />
        </g>

        {/* A (Fused with Geo-Pin & Compass Peak) */}
        <g id="letter-A-nusa">
          <path d="M 216 88 L 238 34 L 260 88" stroke={nusaColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          {/* Latitude crossbar */}
          <path d="M 224 68 Q 238 62 252 68" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
          {/* Integrated Map Pin */}
          <circle cx="238" cy="22" r="7" fill="url(#nusaPinGrad)" />
          <circle cx="238" cy="22" r="3" fill="#FFFFFF" />
          <path d="M 238 29 L 238 36" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* ================= CONNECTOR: - (3-Cluster Data Link) ================= */}
        <g id="cluster-link">
          <line x1="280" y1="60" x2="316" y2="60" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 4" />
          {/* 3 Clusters */}
          <circle cx="286" cy="60" r="5" fill="#2563EB" />
          <circle cx="298" cy="60" r="5" fill="#D97706" />
          <circle cx="310" cy="60" r="5" fill="#EA580C" />
        </g>

        {/* ================= MIPA (Mathematical & AI Typography) ================= */}
        {/* M (Sigma-inspired math precision) */}
        <g id="letter-M">
          <path d="M 338 88 L 338 34 L 358 64 L 378 34 L 378 88" stroke="url(#mipaGrad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="358" cy="64" r="3.5" fill="#FFFFFF" />
        </g>

        {/* I (AI Node / Quantum Dot) */}
        <g id="letter-I">
          <path d="M 404 46 L 404 88" stroke="url(#mipaGrad)" strokeWidth="12" strokeLinecap="round" />
          {/* AI Spark Dot */}
          <circle cx="404" cy="26" r="7.5" fill="#DCFCE7" />
          <circle cx="404" cy="26" r="4.5" fill="#16A34A" />
          <path d="M 404 15 L 404 18 M 404 34 L 404 37 M 393 26 L 396 26 M 412 26 L 415 26" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* P (Mathematical Loop / Ratio) */}
        <g id="letter-P">
          <path d="M 432 88 L 432 34" stroke="url(#mipaGrad)" strokeWidth="12" strokeLinecap="round" />
          <path d="M 432 34 L 452 34 C 466 34 466 62 452 62 L 432 62" stroke="url(#mipaGrad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="450" cy="48" r="3.5" fill="#16A34A" />
        </g>

        {/* A (Delta Gain Δ Symbol & Growth Trend) */}
        <g id="letter-A-mipa">
          <path d="M 480 88 L 500 34 L 520 88" stroke="url(#mipaGrad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 488 68 L 512 68" stroke="#14B8A6" strokeWidth="5" strokeLinecap="round" />
          <path d="M 508 64 L 514 68 L 508 72" fill="none" stroke="#14B8A6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Subtitles */}
        {showSubtitle && (
          <>
            <text x="28" y="112" fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif" fontSize="11" fontWeight="700" fill={subtitleColor} letterSpacing="0.22em">
              SPATIAL ANALYTICS &amp; POLICY SIMULATOR
            </text>
            <text x="338" y="112" fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif" fontSize="11" fontWeight="800" fill="#16A34A" letterSpacing="0.26em">
              EDUCATION 5.0
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
