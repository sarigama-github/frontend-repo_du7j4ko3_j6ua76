import { useEffect, useState } from 'react'

export default function ShowsPanel() {
  const [shows, setShows] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${baseUrl}/api/shows`).then(r => r.json()).then(d => setShows(d.items || [])).catch(() => setShows([]))
  }, [])

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {shows.map((s) => (
        <div key={s._id} className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
          {s.poster && <img src={s.poster} className="w-full h-40 object-cover" />}
          <div className="p-3">
            <div className="text-white font-semibold">{s.title}</div>
            <div className="text-blue-200/70 text-sm">{s.schedule}</div>
            <p className="text-blue-200/80 text-sm mt-1 line-clamp-3">{s.synopsis}</p>
          </div>
        </div>
      ))}
      {!shows.length && <div className="text-blue-200/80">No shows yet.</div>}
    </div>
  )
}
