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

// A near-round cylinder using many thin segments arranged on a circle.
const SEGMENTS = 28 // higher = smoother circle
const RADIUS = 420  // distance from center to each segment (px)
const HEIGHT = 520

export default function Cylinder() {
  const [index, setIndex] = useState(0) // 0..3 for the 4 major faces
  const step = 360 / SEGMENTS

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
          <h2 className="text-xl font-semibold text-white/90">Avang • Circular Cylinder</h2>
          <p className="text-sm text-blue-200/70">Smooth 3D rotation across Live, Latest Video, Shows, and Genres</p>
        </div>
        <button onClick={() => rotate(1)} className="px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition">▶</button>
      </div>

      <div className="relative" style={{ height: HEIGHT + 'px' }}>
        {/* Scene with perspective */}
        <div className="absolute inset-0" style={{ perspective: '1200px' }}>
          {/* Cylinder ring */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out"
            style={{ transformStyle: 'preserve-3d', transform: `translateZ(-${RADIUS}px) rotateY(${rotationDeg}deg)` }}
          >
            {Array.from({ length: SEGMENTS }).map((_, i) => {
              const angle = i * step
              const isContent = contentPositions.includes(i)
              const contentIndex = isContent ? contentPositions.indexOf(i) : -1

              // Subtle lighting based on angle facing viewer (0deg)
              const facing = Math.cos(((angle - rotationDeg) * Math.PI) / 180)
              const brightness = 0.35 + 0.45 * Math.max(0, facing) // 0.35..0.8
              const bg = `linear-gradient(180deg, rgba(20,30,60,${brightness}), rgba(5,10,25,${brightness}))`

              return (
                <div
                  key={i}
                  className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                    background: bg,
                  }}
                >
                  {isContent ? (
                    <PanelContainer title={PANELS[contentIndex].title}>
                      {contentIndex === 0 && <LivePanel />}
                      {contentIndex === 1 && <VideoPanel />}
                      {contentIndex === 2 && <ShowsPanel />}
                      {contentIndex === 3 && <GenresPanel />}
                    </PanelContainer>
                  ) : (
                    <Filler />
                  )}
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
    <div className="w-full h-full flex flex-col">
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
    <div className="w-full h-full">
      {/* Subtle gradient lines to simulate curved surface */}
      <div className="absolute inset-0 opacity-[0.08]" style={{
        background: 'repeating-linear-gradient(90deg, #fff, #fff 2px, transparent 2px, transparent 12px)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(120% 100% at 50% 50%, rgba(255,255,255,0.07), rgba(0,0,0,0) 60%)'
      }} />
    </div>
  )
}
