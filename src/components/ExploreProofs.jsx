import { useEffect, useState } from 'react'

function ExploreProofs() {
  const [actions, setActions] = useState([])
  const [proofs, setProofs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [aRes, pRes] = await Promise.all([
        fetch(`${baseUrl}/actions`),
        fetch(`${baseUrl}/proofs`),
      ])
      const [a, p] = await Promise.all([aRes.json(), pRes.json()])
      setActions(a)
      setProofs(p)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const attest = async (id) => {
    try {
      let signer_address = null
      let signature = null
      let chain_id = null
      if (window.ethereum) {
        try {
          const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
          const cid = await window.ethereum.request({ method: 'eth_chainId' })
          chain_id = parseInt(cid, 16)
          signer_address = account
          // Prepare a simple EIP-191 style message
          const message = `I attest to action ${id} on GreenProof`;
          const from = account
          const msg = '0x' + Buffer.from(message, 'utf8').toString('hex')
          signature = await window.ethereum.request({ method: 'personal_sign', params: [msg, from] })
        } catch (err) {
          console.warn('Wallet signature skipped:', err)
        }
      }
      const res = await fetch(`${baseUrl}/actions/${id}/attest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signer_address, signature, chain_id })
      })
      if (!res.ok) throw new Error('Failed to attest')
      await load()
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <section id="explore" className="py-12">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-100">Explore & Verify</h2>
          <button onClick={load} className="btn-secondary">Refresh</button>
        </div>
        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-2xl p-4 ring-1 ring-slate-800">
              <h3 className="font-semibold text-slate-100 mb-3">Recent Actions</h3>
              <ul className="space-y-3">
                {actions.length === 0 && <li className="text-slate-400">No actions yet.</li>}
                {actions.map(a => (
                  <li key={a.id} className="p-3 rounded-lg bg-slate-800 ring-1 ring-slate-700">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-slate-100 font-medium">{a.title}</p>
                        <p className="text-sm text-slate-400">by {a.actor} • {a.category} • {a.quantity} {a.unit}</p>
                        {a.evidence_url && <a className="text-emerald-300 text-sm underline" href={a.evidence_url} target="_blank">evidence</a>}
                      </div>
                      {!a.attested ? (
                        <button onClick={() => attest(a.id)} className="btn-primary">Attest</button>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-emerald-400/10 text-emerald-300 rounded">Attested</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 rounded-2xl p-4 ring-1 ring-slate-800">
              <h3 className="font-semibold text-slate-100 mb-3">Minted Proofs</h3>
              <ul className="space-y-3">
                {proofs.length === 0 && <li className="text-slate-400">No proofs yet.</li>}
                {proofs.map(p => (
                  <li key={p.id} className="p-3 rounded-lg bg-slate-800 ring-1 ring-slate-700">
                    <p className="text-slate-100 font-medium">{p.tx_id}</p>
                    <p className="text-xs font-mono text-slate-400 break-all">{p.proof_hash}</p>
                    <p className="text-xs text-slate-500">Network: {p.network} • Action: {p.action_id}</p>
                    {p.signer_address && (
                      <p className="text-xs text-slate-500">Signer: {p.signer_address}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ExploreProofs
