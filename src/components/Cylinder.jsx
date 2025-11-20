import { useState } from 'react'
import LivePanel from './LivePanel'
import VideoPanel from './VideoPanel'
import ShowsPanel from './ShowsPanel'
import GenresPanel from './GenresPanel'

const panels = [
  { key: 'live', title: 'Live Channel', component: LivePanel },
  { key: 'latest', title: 'Latest Music Video', component: VideoPanel },
  { key: 'shows', title: 'Shows', component: ShowsPanel },
  { key: 'genres', title: 'Genres', component: GenresPanel },
]

export default function Cylinder() {
  const [index, setIndex] = useState(0)

  const rotate = (dir) => {
    setIndex((prev) => (prev + dir + panels.length) % panels.length)
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => rotate(-1)} className="px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition">◀</button>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white/90">Avang • 4-Sided Cylinder</h2>
          <p className="text-sm text-blue-200/70">Rotate to view Live, Latest Video, Shows, and Genres</p>
        </div>
        <button onClick={() => rotate(1)} className="px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition">▶</button>
      </div>

      <div className="relative h-[520px] perspective-[1200px]">
        <div
          className="absolute inset-0 transform-style-3d transition-transform duration-700"
          style={{ transform: `translateZ(-520px) rotateY(${index * 90}deg)` }}
        >
          {/* Four faces of the cylinder (approximated by a prism) */}
          <Face rotateY={0} translateZ={520}>
            <PanelContainer title={panels[0].title}>
              <LivePanel />
            </PanelContainer>
          </Face>
          <Face rotateY={90} translateZ={520}>
            <PanelContainer title={panels[1].title}>
              <VideoPanel />
            </PanelContainer>
          </Face>
          <Face rotateY={180} translateZ={520}>
            <PanelContainer title={panels[2].title}>
              <ShowsPanel />
            </PanelContainer>
          </Face>
          <Face rotateY={270} translateZ={520}>
            <PanelContainer title={panels[3].title}>
              <GenresPanel />
            </PanelContainer>
          </Face>
        </div>
      </div>
    </div>
  )
}

function Face({ rotateY, translateZ, children }) {
  return (
    <div
      className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      style={{
        transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
        background: 'linear-gradient(180deg, rgba(17,24,39,0.9), rgba(2,6,23,0.9))',
      }}
    >
      {children}
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
