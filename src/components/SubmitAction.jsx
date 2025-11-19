import { useState } from 'react'

const categories = [
  { value: 'renewables', label: 'Renewables (kWh)' },
  { value: 'recycling', label: 'Recycling (kg)' },
  { value: 'reforestation', label: 'Reforestation (trees)' },
  { value: 'transport', label: 'Clean Transport (km/CO₂e)' },
  { value: 'water', label: 'Water Savings (L)' },
  { value: 'buildings', label: 'Green Buildings' },
  { value: 'circular-economy', label: 'Circular Economy' },
  { value: 'other', label: 'Other' },
]

function SubmitAction({ onCreated }) {
  const [form, setForm] = useState({
    actor: '',
    title: '',
    description: '',
    category: 'renewables',
    quantity: '',
    unit: 'kWh',
    location: '',
    evidence_url: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
      })
      if (!res.ok) throw new Error('Failed to create action')
      const data = await res.json()
      onCreated?.(data.id)
      setForm({ actor: '', title: '', description: '', category: 'renewables', quantity: '', unit: 'kWh', location: '', evidence_url: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="submit" className="py-12">
      <div className="container mx-auto px-6">
        <div className="bg-slate-900 rounded-2xl shadow-sm ring-1 ring-slate-800 p-6">
          <h2 className="text-2xl font-bold text-slate-100">Submit a Sustainable Action</h2>
          <p className="text-slate-400 mt-1">Provide measurable details. You can attest it later.</p>
          <form className="grid sm:grid-cols-2 gap-4 mt-6" onSubmit={submit}>
            <input className="col-span-2 sm:col-span-1 input" placeholder="Your name or organization" name="actor" value={form.actor} onChange={handleChange} required />
            <input className="col-span-2 sm:col-span-1 input" placeholder="Short title" name="title" value={form.title} onChange={handleChange} required />
            <textarea className="col-span-2 input h-24" placeholder="Describe the action" name="description" value={form.description} onChange={handleChange} />
            <select className="col-span-2 sm:col-span-1 input" name="category" value={form.category} onChange={handleChange}>
              {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3 col-span-2 sm:col-span-1">
              <input className="input" type="number" step="any" placeholder="Quantity" name="quantity" value={form.quantity} onChange={handleChange} required />
              <input className="input" placeholder="Unit" name="unit" value={form.unit} onChange={handleChange} required />
            </div>
            <input className="col-span-2 sm:col-span-1 input" placeholder="Location (optional)" name="location" value={form.location} onChange={handleChange} />
            <input className="col-span-2 sm:col-span-1 input" placeholder="Evidence URL (optional)" name="evidence_url" value={form.evidence_url} onChange={handleChange} />

            {error && <p className="col-span-2 text-red-400 text-sm">{error}</p>}

            <div className="col-span-2 flex gap-3">
              <button disabled={loading} className="btn-primary" type="submit">
                {loading ? 'Submitting…' : 'Submit Action'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default SubmitAction
