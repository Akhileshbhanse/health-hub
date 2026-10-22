export default function Footer() {
  return (
    <footer className="mx-4 mb-4 mt-auto sm:mx-6">
      <div className="glass-card mx-auto max-w-6xl px-6 py-5 text-center text-sm text-brand-body">
        <p>HealthHub provides general information and is not a substitute for professional medical advice.</p>
        <p className="mt-2 text-xs text-brand-body/70">© {new Date().getFullYear()} HealthHub</p>
      </div>
    </footer>
  )
}
