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
      const res = await fetch(`${baseUrl}/actions/${id}/attest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
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
          <h2 className="text-2xl font-bold text-slate-900">Explore & Verify</h2>
          <button onClick={load} className="btn-secondary">Refresh</button>
        </div>
        {loading ? (
          <p className="text-slate-600">Loading…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 ring-1 ring-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Recent Actions</h3>
              <ul className="space-y-3">
                {actions.length === 0 && <li className="text-slate-500">No actions yet.</li>}
                {actions.map(a => (
                  <li key={a.id} className="p-3 rounded-lg bg-slate-50 ring-1 ring-slate-100">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-slate-900 font-medium">{a.title}</p>
                        <p className="text-sm text-slate-600">by {a.actor} • {a.category} • {a.quantity} {a.unit}</p>
                        {a.evidence_url && <a className="text-emerald-700 text-sm underline" href={a.evidence_url} target="_blank">evidence</a>}
                      </div>
                      {!a.attested ? (
                        <button onClick={() => attest(a.id)} className="btn-primary">Attest</button>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-emerald-600/10 text-emerald-700 rounded">Attested</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-4 ring-1 ring-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Minted Proofs</h3>
              <ul className="space-y-3">
                {proofs.length === 0 && <li className="text-slate-500">No proofs yet.</li>}
                {proofs.map(p => (
                  <li key={p.id} className="p-3 rounded-lg bg-slate-50 ring-1 ring-slate-100">
                    <p className="text-slate-900 font-medium">{p.tx_id}</p>
                    <p className="text-xs font-mono text-slate-600 break-all">{p.proof_hash}</p>
                    <p className="text-xs text-slate-500">Network: {p.network} • Action: {p.action_id}</p>
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