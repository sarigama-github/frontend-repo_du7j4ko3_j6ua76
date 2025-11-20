import Cylinder from './components/Cylinder'
import WalletBar from './components/WalletBar'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(99,102,241,0.25),transparent_60%)] pointer-events-none" />
      <header className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Avang</h1>
          <p className="text-sm text-blue-200/70">Live TV • Music • Shows • Genres • Polygon monetization</p>
        </div>
        <WalletBar />
      </header>

      <main className="relative z-10 px-6 pb-16">
        <Cylinder />
      </main>

      <footer className="relative z-10 max-w-6xl mx-auto px-6 pb-10 text-blue-200/60 text-sm">
        Polygon-powered access with AT token • NFT tickets coming soon
      </footer>
    </div>
  )
}

export default App
