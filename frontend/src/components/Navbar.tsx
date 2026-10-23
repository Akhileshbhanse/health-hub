'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import { Sparkles, BookOpen, CheckCircle, UploadCloud, User, LogOut, LogIn } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Unable to sign out.', error)
      return
    }
    router.push('/auth/login')
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-40 px-4 py-3 sm:px-6">
      <div className="glass-card mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6 border border-white/60 bg-white/60 shadow-lg shadow-brand-leaf/5 backdrop-blur-xl">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-brand-forest">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-leaf to-brand-mint text-white shadow-sm">
            ✦
          </span>
          <span>HealthHub</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-4">
          <Link
            href="/"
            className={`nav-link text-xs sm:text-sm px-2.5 py-1.5 rounded-xl transition-all ${
              isActive('/') ? 'text-brand-forest font-bold bg-brand-pale/60' : ''
            }`}
          >
            Home
          </Link>
          <Link
            href="/tips"
            className={`nav-link text-xs sm:text-sm px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
              isActive('/tips') ? 'text-brand-forest font-bold bg-brand-pale/60' : ''
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-brand-leaf hidden sm:inline" />
            Hygiene Tips
          </Link>

          {!loading && user ? (
            <>
              <Link
                href="/upload"
                className={`nav-link text-xs sm:text-sm px-2.5 py-1.5 rounded-xl transition-all hidden md:flex items-center gap-1 ${
                  isActive('/upload') ? 'text-brand-forest font-bold bg-brand-pale/60' : ''
                }`}
              >
                <UploadCloud className="h-3.5 w-3.5 text-brand-leaf" />
                Upload
              </Link>
              <Link
                href="/account"
                className={`nav-link text-xs sm:text-sm px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                  isActive('/account') ? 'text-brand-forest font-bold bg-brand-pale/60' : ''
                }`}
              >
                <User className="h-3.5 w-3.5 text-brand-leaf hidden sm:inline" />
                Account
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="secondary-button text-xs py-1.5 px-3 ml-1 flex items-center gap-1"
                title="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          ) : !loading ? (
            <div className="flex items-center gap-2 ml-2">
              <Link
                href="/auth/login"
                className="nav-link text-xs sm:text-sm px-2.5 py-1.5 rounded-xl"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="primary-button text-xs py-1.5 px-3.5 shadow-sm"
              >
                Get Started
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
