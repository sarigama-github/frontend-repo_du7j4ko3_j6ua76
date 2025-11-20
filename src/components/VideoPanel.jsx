import { useEffect, useState } from 'react'

export default function VideoPanel() {
  const [videos, setVideos] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${baseUrl}/api/videos`).then(r => r.json()).then(d => setVideos(d.items || [])).catch(() => setVideos([]))
  }, [])

  if (!videos.length) return <div className="text-blue-200/80">No videos yet.</div>

  const v = videos[0]
  const isEmbed = (v.video_url || '').includes('youtube.com')

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="aspect-video w-full bg-black/50 rounded-lg overflow-hidden">
        {isEmbed ? (
          <iframe className="w-full h-full" src={v.video_url} allow="autoplay; encrypted-media" allowFullScreen></iframe>
        ) : (
          <video className="w-full h-full" controls src={v.video_url} />
        )}
      </div>
      <div>
        <h4 className="text-white text-lg font-semibold mb-2">{v.title}</h4>
        <p className="text-blue-200/80 text-sm">{v.artist}{v.genre ? ` • ${v.genre}` : ''}</p>
      </div>
    </div>
  )
}
