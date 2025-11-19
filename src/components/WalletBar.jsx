import { useEffect, useState } from 'react'

function WalletBar() {
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const { ethereum } = window
    if (!ethereum) return

    const handleChainChanged = (cid) => setChainId(cid)
    const handleAccountsChanged = (accs) => setAccount(accs?.[0] || null)

    ethereum.request({ method: 'eth_accounts' }).then((accs) => {
      if (accs && accs.length > 0) setAccount(accs[0])
    }).catch(() => {})

    ethereum.request({ method: 'eth_chainId' }).then(setChainId).catch(() => {})

    ethereum.on?.('chainChanged', handleChainChanged)
    ethereum.on?.('accountsChanged', handleAccountsChanged)

    return () => {
      ethereum.removeListener?.('chainChanged', handleChainChanged)
      ethereum.removeListener?.('accountsChanged', handleAccountsChanged)
    }
  }, [])

  const connect = async () => {
    const { ethereum } = window
    if (!ethereum) {
      alert('No wallet found. Please install MetaMask or a compatible wallet.')
      return
    }
    try {
      const accs = await ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accs?.[0] || null)
      const cid = await ethereum.request({ method: 'eth_chainId' })
      setChainId(cid)
    } catch (e) {
      console.error(e)
    }
  }

  const short = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : ''

  return (
    <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 bg-slate-900/90 border-b border-slate-800">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-200 font-semibold">GreenProof</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn-secondary text-sm">
            {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
          {account ? (
            <span className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 ring-1 ring-slate-700 font-mono text-sm">
              {short(account)} {chainId && <span className="text-slate-400">• chain {parseInt(chainId, 16)}</span>}
            </span>
          ) : (
            <button onClick={connect} className="btn-primary">Connect Wallet</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default WalletBar
