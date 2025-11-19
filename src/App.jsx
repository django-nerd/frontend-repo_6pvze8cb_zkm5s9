import Hero from './components/Hero'
import SubmitAction from './components/SubmitAction'
import ExploreProofs from './components/ExploreProofs'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Hero />

      <main className="relative z-10">
        <SubmitAction onCreated={() => {}} />
        <ExploreProofs />
      </main>

      <footer className="py-12 text-center text-slate-500">
        <p>
          Built with a sustainability-first design. This demo simulates on-chain attestations to make real-world impact transparent.
        </p>
      </footer>
    </div>
  )
}

export default App