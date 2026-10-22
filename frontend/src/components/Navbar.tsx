'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'

export default function Navbar() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Unable to sign out.', error)
      return
    }
    router.push('/auth/login')
  }

  return (
    <nav className="sticky top-0 z-20 px-4 py-4 sm:px-6">
      <div className="glass-card mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-brand-forest">
          <span className="mr-2 text-brand-leaf" aria-hidden="true">✦</span>
          HealthHub
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="nav-link hidden sm:inline">Home</Link>
          {!loading && user ? (
            <>
              <Link href="/account" className="nav-link">Account</Link>
              <button type="button" onClick={handleLogout} className="secondary-button">
                Log out
              </button>
            </>
          ) : !loading ? (
            <>
              <Link href="/auth/login" className="nav-link">Log in</Link>
              <Link href="/auth/signup" className="primary-button px-4 py-2 text-sm">Sign up</Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
