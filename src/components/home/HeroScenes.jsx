import { useMemo } from 'react'

/*
 * Four illustrated hero scenes (inline SVG, no network needed). Each one is
 * drawn on a 500 x 600 canvas and cropped with "slice", so it fills any frame.
 * Drop real photos into src/assets/hero/ to replace them (see the README there).
 */

const FONT = "'Hind Siliguri', 'Bricolage Grotesque', sans-serif"

function Svg({ children, label }) {
  return (
    <svg viewBox="0 0 500 600" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label} width="100%" height="100%">
      {children}
    </svg>
  )
}

/* 1 — Campus and hiring */
function CampusScene() {
  const cols = [200, 222, 244, 266, 288]
  const winsL = [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => ({ x: 124 + c * 20, y: 352 + r * 42 })))
  const winsR = [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => ({ x: 322 + c * 20, y: 352 + r * 42 })))
  const grads = [
    { x: 150, c: '#ffd978' },
    { x: 196, c: '#ffffff' },
    { x: 330, c: '#9ee6d6' },
    { x: 372, c: '#ffd978' },
  ]
  return (
    <Svg label="University building with graduates walking on the campus path">
      <defs>
        <linearGradient id="cs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fb4ff" />
          <stop offset="1" stopColor="#eaf2ff" />
        </linearGradient>
        <radialGradient id="cs-sun">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="500" height="600" fill="url(#cs-sky)" />
      <circle cx="390" cy="130" r="120" fill="url(#cs-sun)" />
      <circle cx="390" cy="130" r="32" fill="#ffd978" />
      <path d="M0 400 Q90 340 190 378 T370 362 T500 384 V600 H0Z" fill="#b6caf3" />
      <path d="M0 440 Q120 400 250 430 T500 420 V600 H0Z" fill="#9db7ec" />

      {/* building */}
      <rect x="104" y="330" width="292" height="176" fill="#243f94" />
      <rect x="188" y="292" width="124" height="214" fill="#2c55c4" />
      <polygon points="178,294 250,246 322,294" fill="#1b3685" />
      <rect x="237" y="210" width="26" height="38" fill="#1b3685" />
      <polygon points="232,212 250,190 268,212" fill="#16306f" />
      <circle cx="250" cy="228" r="7" fill="#ffd978" />
      {cols.map((x) => (
        <rect key={x} x={x} y="300" width="9" height="206" fill="#eaf1ff" />
      ))}
      <path d="M236 506 V462 a14 14 0 0 1 28 0 V506Z" fill="#0f2a6b" />
      {[...winsL, ...winsR].map((w, i) => (
        <rect key={i} x={w.x} y={w.y} width="12" height="22" rx="2" fill="#bcd3ff" opacity="0.92" />
      ))}
      <rect x="168" y="500" width="164" height="8" fill="#8aa6e6" />
      <rect x="150" y="508" width="200" height="8" fill="#7390d8" />

      {/* ground */}
      <rect y="516" width="500" height="84" fill="#1b2f6b" />
      <polygon points="214,516 286,516 400,600 100,600" fill="#3b57a8" />

      {/* trees */}
      {[56, 452].map((x) => (
        <g key={x}>
          <rect x={x - 4} y="450" width="8" height="66" fill="#16306f" />
          <circle cx={x} cy="436" r="34" fill="#2f9a74" />
          <circle cx={x - 18} cy="458" r="22" fill="#38ad84" />
          <circle cx={x + 18} cy="458" r="22" fill="#2a8a68" />
        </g>
      ))}

      {/* graduates */}
      {grads.map((g, i) => (
        <g key={i} transform={`translate(${g.x} ${i % 2 ? 540 : 528})`}>
          <rect x="-9" y="0" width="18" height="44" rx="9" fill={g.c} />
          <circle cx="0" cy="-10" r="9" fill="#f6d3b4" />
          <polygon points="-14,-18 0,-25 14,-18 0,-11" fill="#101c3d" />
          <path d="M10 -18 V-8" stroke="#ffd978" strokeWidth="2" />
        </g>
      ))}
    </Svg>
  )
}

/* 2 — Study abroad: dot-matrix globe with flight routes */
const LAND = [
  { x: 262, y: 232, rx: 92, ry: 40, r: -8 }, // Eurasia
  { x: 236, y: 318, rx: 36, ry: 58, r: 8 }, // Africa
  { x: 300, y: 306, rx: 20, ry: 30, r: 10 }, // South Asia
  { x: 148, y: 236, rx: 52, ry: 48, r: 20 }, // N. America
  { x: 192, y: 388, rx: 26, ry: 48, r: -18 }, // S. America
  { x: 348, y: 386, rx: 32, ry: 20, r: 0 }, // Australia
]

function inLand(px, py) {
  return LAND.some((e) => {
    const a = (-e.r * Math.PI) / 180
    const dx = px - e.x
    const dy = py - e.y
    const rx = dx * Math.cos(a) - dy * Math.sin(a)
    const ry = dx * Math.sin(a) + dy * Math.cos(a)
    return (rx * rx) / (e.rx * e.rx) + (ry * ry) / (e.ry * e.ry) <= 1
  })
}

const BD = { x: 300, y: 296 }
const DESTS = [
  { id: 'UK', x: 230, y: 206, lift: 70 },
  { id: 'DE', x: 252, y: 216, lift: 40 },
  { id: 'JP', x: 360, y: 238, lift: 60 },
  { id: 'AU', x: 346, y: 384, lift: 20 },
]

function AbroadScene() {
  const dots = useMemo(() => {
    const out = []
    const cx = 250
    const cy = 300
    const R = 150
    for (let y = cy - R; y <= cy + R; y += 10) {
      for (let x = cx - R; x <= cx + R; x += 10) {
        if ((x - cx) ** 2 + (y - cy) ** 2 > (R - 4) ** 2) continue
        out.push({ x, y, land: inLand(x, y) })
      }
    }
    return out
  }, [])

  const arc = (d) => `M${BD.x} ${BD.y} Q${(BD.x + d.x) / 2} ${Math.min(BD.y, d.y) - d.lift} ${d.x} ${d.y}`

  return (
    <Svg label="Globe with flight routes from Bangladesh to universities abroad">
      <defs>
        <linearGradient id="ab-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#06303a" />
          <stop offset="1" stopColor="#0d7478" />
        </linearGradient>
        <radialGradient id="ab-globe" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#13a3a6" />
          <stop offset="1" stopColor="#085058" />
        </radialGradient>
      </defs>
      <rect width="500" height="600" fill="url(#ab-bg)" />
      <circle cx="250" cy="300" r="176" fill="none" stroke="#7de3d6" strokeOpacity="0.18" />
      <circle cx="250" cy="300" r="150" fill="url(#ab-globe)" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.land ? 2.6 : 1.1} fill={d.land ? '#a6f2e5' : '#ffffff'} opacity={d.land ? 0.95 : 0.2} />
      ))}

      {DESTS.map((d, i) => (
        <g key={d.id}>
          <path d={arc(d)} fill="none" stroke="#ffd978" strokeWidth="1.6" strokeDasharray="3 6" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" from="0" to="-36" dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" />
          </path>
          <circle cx={d.x} cy={d.y} r="5" fill="#ffd978" />
          <circle cx={d.x} cy={d.y} r="9" fill="none" stroke="#ffd978" strokeOpacity="0.5" />
          <g transform={`translate(${d.id === 'UK' ? d.x - 40 : d.x + 10} ${d.y - 24})`}>
            <rect width="30" height="18" rx="9" fill="#04252b" opacity="0.85" />
            <text x="15" y="12.5" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#ffffff" fontFamily={FONT}>
              {d.id}
            </text>
          </g>
        </g>
      ))}

      {/* Bangladesh */}
      <circle cx={BD.x} cy={BD.y} r="6.5" fill="#ffffff" />
      <circle cx={BD.x} cy={BD.y} r="12" fill="none" stroke="#ffffff" strokeOpacity="0.55">
        <animate attributeName="r" values="8;18;8" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.7;0;0.7" dur="2.4s" repeatCount="indefinite" />
      </circle>

      {/* paper plane on the UK route */}
      <g>
        <path d="M-9 -5 L11 0 L-9 5 L-5 0Z" fill="#ffffff" />
        <animateMotion dur="4.2s" repeatCount="indefinite" rotate="auto" path={arc(DESTS[0])} />
      </g>

      {/* graduation cap + passport */}
      <g transform="translate(70 96) rotate(-10)">
        <polygon points="0,10 34,-4 68,10 34,24" fill="#e4f8f3" />
        <path d="M14 18 V34 Q34 44 54 34 V18" fill="#9fe0d6" />
        <path d="M64 12 V34" stroke="#ffd978" strokeWidth="2.4" />
      </g>
      <g transform="translate(372 76) rotate(8)">
        <rect width="56" height="76" rx="6" fill="#f2f6ff" />
        <circle cx="28" cy="32" r="12" fill="none" stroke="#0d7478" strokeWidth="2.4" />
        <path d="M16 32 H40 M28 20 Q22 32 28 44 M28 20 Q34 32 28 44" stroke="#0d7478" strokeWidth="1.6" fill="none" />
        <rect x="12" y="54" width="32" height="4" rx="2" fill="#0d7478" opacity="0.5" />
      </g>
    </Svg>
  )
}

/* 3 — Research and labs: a chip with live traces */
const TRACES = [
  'M250 215 V150 H120 V90',
  'M250 215 V120 H380 V70',
  'M165 270 H90 V360 H40',
  'M335 270 H410 V340 H470',
  'M165 330 H110 V440 H190 V520',
  'M335 330 H390 V450 H320 V540',
  'M210 385 V470 H260 V560',
]

function ResearchScene() {
  const pins = [0, 1, 2, 3, 4, 5]
  return (
    <Svg label="Microchip with glowing circuit traces">
      <defs>
        <linearGradient id="rs-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#09112a" />
          <stop offset="1" stopColor="#14265a" />
        </linearGradient>
        <pattern id="rs-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0 H0 V32" fill="none" stroke="#2d4aa0" strokeOpacity="0.22" />
        </pattern>
      </defs>
      <rect width="500" height="600" fill="url(#rs-bg)" />
      <rect width="500" height="600" fill="url(#rs-grid)" />
      {TRACES.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="#3c68ff" strokeWidth="2.2" strokeOpacity="0.75" />
          <circle r="3.6" fill="#9fc0ff">
            <animateMotion dur={`${3 + (i % 3)}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" path={d} />
          </circle>
        </g>
      ))}

      <rect x="165" y="215" width="170" height="170" rx="16" fill="#101f4d" stroke="#5f86ff" strokeWidth="2" />
      {pins.map((i) => (
        <g key={i}>
          <rect x={178 + i * 25} y="205" width="8" height="10" fill="#9fc0ff" />
          <rect x={178 + i * 25} y="385" width="8" height="10" fill="#9fc0ff" />
          <rect x="155" y={228 + i * 25} width="10" height="8" fill="#9fc0ff" />
          <rect x="335" y={228 + i * 25} width="10" height="8" fill="#9fc0ff" />
        </g>
      ))}
      <rect x="198" y="248" width="104" height="104" rx="10" fill="#0a1534" stroke="#3c68ff" />
      <path d="M216 300 H236 L246 276 L260 324 L270 300 H286" fill="none" stroke="#ffd978" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {[
        { t: 'VLSI', x: 78, y: 76 },
        { t: 'RF', x: 360, y: 52 },
        { t: 'IoT', x: 20, y: 372 },
        { t: 'DSP', x: 408, y: 352 },
      ].map((l) => (
        <g key={l.t} transform={`translate(${l.x} ${l.y})`}>
          <rect width={l.t.length * 10 + 22} height="26" rx="13" fill="#0a1534" stroke="#5f86ff" />
          <text x={(l.t.length * 10 + 22) / 2} y="17.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#cfe0ff" fontFamily={FONT}>
            {l.t}
          </text>
        </g>
      ))}
    </Svg>
  )
}

/* 4 — Mentorship: two people, a laptop, a referral */
function MentorScene() {
  return (
    <Svg label="Alumnus mentoring a student across a table">
      <defs>
        <linearGradient id="mt-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffeab9" />
          <stop offset="1" stopColor="#ffbf5c" />
        </linearGradient>
      </defs>
      <rect width="500" height="600" fill="url(#mt-bg)" />
      <circle cx="400" cy="120" r="70" fill="#fff5d6" opacity="0.7" />
      <rect y="470" width="500" height="130" fill="#17275c" />

      {/* mentor */}
      <g>
        <circle cx="168" cy="268" r="30" fill="#17275c" />
        <path d="M100 460 Q100 332 168 332 Q236 332 236 460Z" fill="#2f55c8" />
        <path d="M148 336 L168 372 L188 336" fill="#eaf1ff" />
      </g>
      {/* student */}
      <g>
        <circle cx="338" cy="288" r="27" fill="#17275c" />
        <path d="M278 460 Q278 350 338 350 Q398 350 398 460Z" fill="#f4a62a" />
        <path d="M318 354 Q338 372 358 354" fill="none" stroke="#17275c" strokeWidth="3" />
      </g>
      {/* table + laptop */}
      <rect x="70" y="440" width="360" height="16" rx="4" fill="#0f1b45" />
      <rect x="86" y="456" width="10" height="56" fill="#0f1b45" />
      <rect x="404" y="456" width="10" height="56" fill="#0f1b45" />
      <path d="M214 440 L226 400 H286 L298 440Z" fill="#dfe8ff" />
      <rect x="232" y="410" width="48" height="4" rx="2" fill="#2f55c8" />
      <rect x="232" y="420" width="32" height="4" rx="2" fill="#2f55c8" opacity="0.5" />

      {/* speech bubbles */}
      <g transform="translate(52 150)">
        <rect width="148" height="66" rx="16" fill="#ffffff" />
        <path d="M30 66 L42 84 L56 66Z" fill="#ffffff" />
        <rect x="18" y="16" width="100" height="8" rx="4" fill="#2f55c8" />
        <rect x="18" y="32" width="72" height="8" rx="4" fill="#9db7ec" />
        <rect x="18" y="46" width="52" height="8" rx="4" fill="#cfdcf8" />
      </g>
      <g transform="translate(290 112)">
        <rect width="150" height="64" rx="16" fill="#17275c" />
        <path d="M110 64 L120 82 L132 64Z" fill="#17275c" />
        <circle cx="34" cy="32" r="14" fill="#2ecf9a" />
        <path d="M27 32 L32 37 L42 26" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="58" y="22" width="68" height="8" rx="4" fill="#eaf1ff" />
        <rect x="58" y="36" width="44" height="8" rx="4" fill="#9db7ec" />
      </g>
    </Svg>
  )
}

const COMMONS = 'https://commons.wikimedia.org/wiki/'

// Real photos hosted on Wikimedia Commons (all CC BY-SA 4.0). If one can't load,
// the illustrated Scene is shown instead, so the hero never shows a broken image.
export const SCENES = [
  {
    key: 'gate', Scene: CampusScene, title: 'slide_campus_t', desc: 'slide_campus_d',
    photo: { file: 'Entrance_Gate_RUET.jpg', author: 'Wikimedia Commons contributor', pos: 'center 55%' },
  },
  { key: 'abroad', Scene: AbroadScene, title: 'slide_abroad_t', desc: 'slide_abroad_d' },
  {
    key: 'campus', Scene: ResearchScene, title: 'slide_research_t', desc: 'slide_research_d',
    photo: { file: 'Rajshahi_University_of_Engineering_and_Technology_(RUET)_Campus.jpg', author: 'raja.sheikh.bd', pos: 'center 60%' },
  },
  {
    key: 'arch', Scene: MentorScene, title: 'slide_depts_t', desc: 'slide_depts_d',
    photo: { file: 'RUET_Architecture_Building.jpg', author: 'Wikimedia Commons contributor', pos: 'center 50%' },
  },
]

export const photoSrc = (file, width) => `${COMMONS}Special:FilePath/${file}?width=${width}`
export const photoPage = (file) => `${COMMONS}File:${file}`
