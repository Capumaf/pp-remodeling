"use client";

/**
 * Doble techo con sombra + línea base — color de marca #2E7D32
 * Ajustes:
 * 1) Sombra del primer techo más pegada y visible.
 * 2) Ventana más centrada y arriba.
 * 3) Chimenea más hacia adentro y tangente al plano del techo trasero.
 */

const BRAND = "#2E7D32";
const SHADOW = "#C9CDD3"; // gris sombra

export default function AnimatedHouse() {
  return (
    <div className="w-full max-w-xl" role="img" aria-label="P&P Remodeling – doble techo con sombra">
      <svg viewBox="0 0 840 360" className="block w-full h-48 sm:h-64 md:h-80 lg:h-[420px]">
        {/* ===== LÍNEA BASE ===== */}
        <rect x="120" y="300" width="600" height="14" rx="2" fill={BRAND} className="ah-base" />

        {/* ===== TECHO TRASERO (derecha) ===== */}
        {/* Sombra interior del trasero (paralela y cercana) */}
        <path
          d="M520 258 L620 150 L720 258"
          fill="none"
          stroke={SHADOW}
          strokeWidth="12"
          strokeLinecap="square"
          className="ah-fade ah-delay-2"
        />
        {/* Trazo principal trasero */}
        <path
          d="M500 270 L620 140 L740 270"
          fill="none"
          stroke={BRAND}
          strokeWidth="18"
          strokeLinejoin="miter"
          strokeLinecap="square"
          className="ah-draw ah-delay-1"
        />
        {/* Chimenea */}
        <rect
          x="645"
          y="132"
          width="16"
          height="44"
          fill={BRAND}
          className="ah-fade ah-delay-3"
        />

        {/* ===== TECHO DELANTERO (izquierda) ===== */}
        <path
          d="M236 254 L340 150 L444 254"
          fill="none"
          stroke={SHADOW}
          strokeWidth="12"
          strokeLinecap="square"
          className="ah-fade ah-delay-2"
        />
        <path
          d="M220 270 L340 140 L460 270"
          fill="none"
          stroke={BRAND}
          strokeWidth="18"
          strokeLinejoin="miter"
          strokeLinecap="square"
          className="ah-draw"
        />

        {/* ===== VENTANA 2x2 ===== */}
        <g className="ah-pop" fill={BRAND}>
          <rect x="322" y="220" width="18" height="18" />
          <rect x="344" y="220" width="18" height="18" />
          <rect x="322" y="240" width="18" height="18" />
          <rect x="344" y="240" width="18" height="18" />
        </g>
      </svg>

      {/* Animaciones CSS */}
      <style jsx>{`
        .ah-draw {
          stroke-dasharray: 520;
          stroke-dashoffset: 520;
          animation: draw 3000ms ease-in-out forwards;
        }
        .ah-delay-1 { animation-delay: 600ms; }
        .ah-delay-2 { animation-delay: 1200ms; }
        .ah-delay-3 { animation-delay: 1800ms; }

        .ah-fade {
          opacity: 0;
          animation: fade 2000ms 2200ms ease-in-out forwards;
        }

        .ah-pop {
          opacity: 0;
          transform: translateY(8px);
          animation: pop 1800ms 3000ms ease-out forwards;
        }

        .ah-base {
          transform: scaleX(0.9);
          transform-origin: center;
          animation: baseIn 2200ms 3800ms ease-out forwards;
          opacity: 0;
        }

        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes fade { to { opacity: 1; } }
        @keyframes pop { to { opacity: 1; transform: translateY(0); } }
        @keyframes baseIn { to { opacity: 1; transform: scaleX(1); } }

        @media (prefers-reduced-motion: reduce) {
          .ah-draw, .ah-fade, .ah-pop, .ah-base {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            stroke-dashoffset: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
