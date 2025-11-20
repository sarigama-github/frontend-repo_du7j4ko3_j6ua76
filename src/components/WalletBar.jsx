import { useState } from 'react'

export default function WalletBar() {
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const connect = async () => {
    if (!window.ethereum) {
      setStatus('Install a Web3 wallet like MetaMask to continue.')
      return
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAddress(accounts[0])
      setStatus('Connected')
    } catch (e) {
      setStatus('Connection rejected')
    }
  }

  const mockBuy = async () => {
    if (!address) return setStatus('Connect wallet first')
    try {
      const res = await fetch(`${baseUrl}/api/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: address, event_id: 'AVANG-001' })
      })
      const data = await res.json()
      if (res.ok) setStatus(`Ticket purchased with ${data.token_symbol} • Tx: ${data.tx_hash.slice(0,10)}...`)
      else setStatus(data.detail || 'Purchase failed')
    } catch (e) {
      setStatus('Network error')
    }
  }

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white">
      {address ? (
        <div className="text-xs text-blue-200/80">{address.slice(0,6)}...{address.slice(-4)} on Polygon</div>
      ) : (
        <button onClick={connect} className="px-3 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm">Connect Wallet</button>
      )}
      <button onClick={mockBuy} className="px-3 py-1.5 rounded bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-sm">Buy Ticket (Mock)</button>
      {status && <span className="text-xs text-blue-200/80">{status}</span>}
    </div>
  )
}
