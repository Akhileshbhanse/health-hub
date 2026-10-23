import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mx-4 mb-4 mt-auto sm:mx-6">
      <div className="glass-card mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 text-sm text-brand-body sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p>HealthHub provides general information and is not a substitute for professional medical advice.</p>
          <p className="mt-2 text-xs text-brand-body/70">© {new Date().getFullYear()} HealthHub</p>
        </div>
        <nav className="flex flex-wrap gap-4 font-semibold" aria-label="Footer navigation">
          <Link href="/" className="hover:text-brand-forest">Home</Link>
          <Link href="/tips" className="hover:text-brand-forest">Tips</Link>
          <Link href="/dashboard" className="hover:text-brand-forest">Dashboard</Link>
        </nav>
      </div>
    </footer>
  )
}
