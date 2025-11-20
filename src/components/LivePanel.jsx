import { useEffect, useState } from 'react'

export default function LivePanel() {
  const [channels, setChannels] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${baseUrl}/api/live-channels`).then(r => r.json()).then(d => setChannels(d.items || [])).catch(() => setChannels([]))
  }, [])

  if (!channels.length) {
    return <div className="text-blue-200/80">No live channels yet.</div>
  }

  const ch = channels[0]

  // If HLS URL, use hls.js ideally; for demo, we use video tag which some browsers support natively
  const isEmbed = (ch.stream_url || '').includes('youtube.com') || (ch.stream_url || '').includes('embed')

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="aspect-video w-full bg-black/50 rounded-lg overflow-hidden">
        {isEmbed ? (
          <iframe className="w-full h-full" src={ch.stream_url} allow="autoplay; encrypted-media" allowFullScreen></iframe>
        ) : (
          <video className="w-full h-full" controls src={ch.stream_url} />
        )}
      </div>
      <div>
        <h4 className="text-white text-lg font-semibold mb-2">{ch.name}</h4>
        <p className="text-blue-200/80 text-sm">{ch.description || 'Live streaming now'}</p>
      </div>
    </div>
  )
}
