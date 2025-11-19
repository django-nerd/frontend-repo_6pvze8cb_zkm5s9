import Spline from '@splinetool/react-spline';

function Hero() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/vi0ijCQQJTRFc8LA/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      {/* Soft gradient overlay for readable text, doesn't block pointer events on 3D */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/80"></div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-600/10 text-emerald-700 ring-1 ring-emerald-600/20 mb-4">
              <span className="text-xs font-semibold">Sustainable • Blockchain-inspired</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900">
              GreenProof: Verify Real‑World Impact
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-slate-700">
              Submit measurable climate actions and mint tamper‑evident attestations. 
              Encourage transparency, fight greenwashing, and unlock climate finance.
            </p>
            <div className="mt-8 flex gap-3">
              <a href="#submit" className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-5 py-3 font-semibold shadow hover:bg-emerald-700 transition">
                Submit an Action
              </a>
              <a href="#explore" className="inline-flex items-center rounded-lg bg-white text-slate-900 px-5 py-3 font-semibold shadow ring-1 ring-slate-200 hover:bg-slate-50 transition">
                Explore Proofs
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero