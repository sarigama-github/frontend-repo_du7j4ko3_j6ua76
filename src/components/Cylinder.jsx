import { useMemo, useState } from 'react'
import LivePanel from './LivePanel'
import VideoPanel from './VideoPanel'
import ShowsPanel from './ShowsPanel'
import GenresPanel from './GenresPanel'

const PANELS = [
  { key: 'live', title: 'Live Channel', component: LivePanel },
  { key: 'latest', title: 'Latest Music Video', component: VideoPanel },
  { key: 'shows', title: 'Shows', component: ShowsPanel },
  { key: 'genres', title: 'Genres', component: GenresPanel },
]

// Cylinder parameters
const SEGMENTS = 48 // more slats -> smoother
const RADIUS = 420
const HEIGHT = 520

export default function Cylinder() {
  const [index, setIndex] = useState(0)
  const step = 360 / SEGMENTS
  const circumference = 2 * Math.PI * RADIUS
  const faceWidth = Math.round(circumference / SEGMENTS)

  const rotate = (dir) => setIndex((p) => (p + dir + PANELS.length) % PANELS.length)

  const contentPositions = useMemo(() => {
    const quarter = SEGMENTS / 4
    return [0, quarter, quarter * 2, quarter * 3].map((pos) => Math.round(pos) % SEGMENTS)
  }, [])

  const rotationDeg = index * (360 / PANELS.length)
  const tiltDeg = -12 // slight tilt to reveal top ellipse

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => rotate(-1)} className="px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition">◀</button>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white/90">Avang • Cylindrical Deck</h2>
          <p className="text-sm text-blue-200/70">Live • Video • Shows • Genres mounted on a round shell</p>
        </div>
        <button onClick={() => rotate(1)} className="px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition">▶</button>
      </div>

      <div className="relative" style={{ height: HEIGHT + 'px' }}>
        {/* Scene with perspective */}
        <div className="absolute inset-0 overflow-visible" style={{ perspective: '1400px' }}>
          {/* WORLD */}
          <div
            className="absolute inset-0 transition-transform duration-800 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translateZ(-${RADIUS}px) rotateX(${tiltDeg}deg) rotateY(${rotationDeg}deg)`,
            }}
          >
            {/* Top cap (ellipse) */}
            <div
              aria-hidden
              className="absolute"
              style={{
                width: RADIUS * 2 + 'px',
                height: RADIUS * 2 + 'px',
                left: '50%',
                top: '50%',
                marginLeft: -RADIUS + 'px',
                marginTop: -(HEIGHT / 2) - RADIUS + 'px',
                borderRadius: '50%',
                transformStyle: 'preserve-3d',
                transform: `rotateX(90deg)`,
                background:
                  'radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.22) 0%, rgba(120,160,255,0.12) 35%, rgba(0,0,0,0.45) 100%)',
                boxShadow: '0 20px 80px rgba(0,0,0,0.45) inset',
                opacity: 0.7,
              }}
            />

            {/* Bottom cap (ellipse, shadowed) */}
            <div
              aria-hidden
              className="absolute"
              style={{
                width: RADIUS * 2 + 'px',
                height: RADIUS * 2 + 'px',
                left: '50%',
                top: '50%',
                marginLeft: -RADIUS + 'px',
                marginTop: (HEIGHT / 2) - RADIUS + 'px',
                borderRadius: '50%',
                transformStyle: 'preserve-3d',
                transform: `rotateX(90deg)`,
                background:
                  'radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0.9) 100%)',
                filter: 'blur(2px)',
                opacity: 0.8,
              }}
            />

            {/* Cylindrical shell made of narrow slats */}
            {Array.from({ length: SEGMENTS }).map((_, i) => {
              const angle = i * step
              const isAnchor = contentPositions.includes(i)
              const contentIndex = isAnchor ? contentPositions.indexOf(i) : -1

              // Cosine-based lighting toward viewer normal
              const facing = Math.cos(((angle - rotationDeg) * Math.PI) / 180)
              const light = 0.25 + 0.55 * Math.max(0, facing)
              const bg = `linear-gradient(180deg, rgba(30,45,90,${light}), rgba(5,10,28,${light}))`

              if (!isAnchor) {
                return (
                  <div
                    key={`slat-${i}`]
                    className="absolute top-0"
                    style={{
                      width: faceWidth + 'px',
                      height: HEIGHT + 'px',
                      left: '50%',
                      marginLeft: -(faceWidth / 2) + 'px',
                      backfaceVisibility: 'hidden',
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                      background: bg,
                      overflow: 'hidden',
                    }}
                  >
                    <Filler light={light} />
                  </div>
                )
              }

              // Content window spans multiple slats to be readable
              const span = 6
              const panelWidth = faceWidth * span

              return (
                <div
                  key={`panel-${i}`]
                  className="absolute top-0"
                  style={{
                    width: panelWidth + 'px',
                    height: HEIGHT + 'px',
                    left: '50%',
                    marginLeft: -(panelWidth / 2) + 'px',
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                    overflow: 'hidden',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
                  }}
                >
                  <PanelContainer title={PANELS[contentIndex].title}>
                    {contentIndex === 0 && <LivePanel />}
                    {contentIndex === 1 && <VideoPanel />}
                    {contentIndex === 2 && <ShowsPanel />}
                    {contentIndex === 3 && <GenresPanel />}
                  </PanelContainer>
                </div>
              )
            })}
          </div>

          {/* Global vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(80% 60% at 50% 50%, rgba(255,255,255,0.06), rgba(0,0,0,0.0) 55%, rgba(0,0,0,0.35) 100%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

function PanelContainer({ title, children }) {
  return (
    <div className="w-full h-full flex flex-col bg-[rgba(10,14,30,0.88)] backdrop-blur-md border border-white/10">
      <div className="px-5 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-white/90 font-semibold">{title}</h3>
        <div className="text-xs text-blue-200/70">Avang • Polygon Powered</div>
      </div>
      <div className="flex-1 p-4 overflow-auto">{children}</div>
    </div>
  )
}

function Filler({ light = 0.5 }) {
  return (
    <div className="w-full h-full relative">
      {/* Subtle longitudinal lines */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ background: 'repeating-linear-gradient(90deg, #ffffff, #ffffff 2px, transparent 2px, transparent 12px)' }}
      />
      {/* Curvature vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 100% at 50% 50%, rgba(255,255,255,${0.06 + light * 0.04}), rgba(0,0,0,0) 60%)`,
        }}
      />
    </div>
  )
}
