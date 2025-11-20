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

// Near-round cylinder using many thin segments arranged on a circle.
const SEGMENTS = 28 // higher = smoother circle
const RADIUS = 420  // px
const HEIGHT = 520  // px

export default function Cylinder() {
  const [index, setIndex] = useState(0) // 0..3 for the 4 major faces
  const step = 360 / SEGMENTS
  const circumference = 2 * Math.PI * RADIUS
  const faceWidth = Math.round(circumference / SEGMENTS) // width of each thin face

  const rotate = (dir) => setIndex((prev) => (prev + dir + PANELS.length) % PANELS.length)

  // Map 4 content faces evenly around 360 degrees
  const contentPositions = useMemo(() => {
    const quarter = SEGMENTS / 4
    return [0, quarter, quarter * 2, quarter * 3].map((pos) => Math.round(pos) % SEGMENTS)
  }, [])

  const rotationDeg = index * (360 / PANELS.length)

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => rotate(-1)} className="px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition">◀</button>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white/90">Avang • Cylindrical Carousel</h2>
          <p className="text-sm text-blue-200/70">A true circular shell with four content windows</p>
        </div>
        <button onClick={() => rotate(1)} className="px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition">▶</button>
      </div>

      <div className="relative" style={{ height: HEIGHT + 'px' }}>
        {/* Scene with perspective */}
        <div className="absolute inset-0 overflow-visible" style={{ perspective: '1200px' }}>
          {/* Cylinder ring */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out"
            style={{ transformStyle: 'preserve-3d', transform: `translateZ(-${RADIUS}px) rotateY(${rotationDeg}deg)` }}
          >
            {Array.from({ length: SEGMENTS }).map((_, i) => {
              const angle = i * step
              const isContentAnchor = contentPositions.includes(i)
              const contentIndex = isContentAnchor ? contentPositions.indexOf(i) : -1

              // Subtle lighting based on angle facing viewer (0deg)
              const facing = Math.cos(((angle - rotationDeg) * Math.PI) / 180)
              const brightness = 0.28 + 0.50 * Math.max(0, facing) // 0.28..0.78
              const bg = `linear-gradient(180deg, rgba(24,35,70,${brightness}), rgba(7,12,30,${brightness}))`

              // Base thin slat
              const baseFace = (
                <div
                  key={`slat-${i}`}
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
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                    overflow: 'hidden',
                  }}
                >
                  <Filler />
                </div>
              )

              // Replace the anchor slat with a wider content window to be readable
              if (!isContentAnchor) return baseFace

              const panelSpan = 6 // number of slats worth of width for each content window
              const panelWidth = faceWidth * panelSpan

              return (
                <div
                  key={`panel-${i}`}
                  className="absolute top-0"
                  style={{
                    width: panelWidth + 'px',
                    height: HEIGHT + 'px',
                    left: '50%',
                    marginLeft: -(panelWidth / 2) + 'px',
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                    borderRadius: '18px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
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

          {/* Ambient vignette to reinforce roundness */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
            background: 'radial-gradient(80% 60% at 50% 50%, rgba(255,255,255,0.06), rgba(0,0,0,0.0) 55%, rgba(0,0,0,0.35) 100%)'
          }} />
        </div>
      </div>
    </div>
  )
}

function PanelContainer({ title, children }) {
  return (
    <div className="w-full h-full flex flex-col bg-[rgba(10,14,30,0.85)] backdrop-blur-md border border-white/10">
      <div className="px-5 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-white/90 font-semibold">{title}</h3>
        <div className="text-xs text-blue-200/70">Avang • Polygon Powered</div>
      </div>
      <div className="flex-1 p-4 overflow-auto">{children}</div>
    </div>
  )
}

function Filler() {
  return (
    <div className="w-full h-full relative">
      {/* Subtle gradient lines to simulate curved surface */}
      <div className="absolute inset-0 opacity-[0.08]" style={{
        background: 'repeating-linear-gradient(90deg, #ffffff, #ffffff 2px, transparent 2px, transparent 12px)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(120% 100% at 50% 50%, rgba(255,255,255,0.07), rgba(0,0,0,0) 60%)'
      }} />
    </div>
  )
}
