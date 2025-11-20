import { useEffect, useState } from 'react'

export default function GenresPanel() {
  const [genres, setGenres] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${baseUrl}/api/genres`).then(r => r.json()).then(d => setGenres(d.items || [])).catch(() => setGenres([]))
  }, [])

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {genres.map((g) => (
        <div key={g._id} className="rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 border border-white/10">
          {g.cover && <img src={g.cover} className="w-full h-40 object-cover" />}
          <div className="p-4">
            <div className="text-white font-semibold text-lg">{g.name}</div>
            {g.description && <p className="text-blue-200/80 text-sm mt-1">{g.description}</p>}
          </div>
        </div>
      ))}
      {!genres.length && <div className="text-blue-200/80">No genres yet.</div>}
    </div>
  )
}
