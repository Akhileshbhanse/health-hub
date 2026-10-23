'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import {
  User as UserIcon,
  Mail,
  Calendar,
  Bookmark,
  ShieldCheck,
  UploadCloud,
  LogOut,
  ArrowRight,
  BookOpen,
} from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [bookmarksCount, setBookmarksCount] = useState(0)
  const [uploadsCount, setUploadsCount] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        router.replace('/auth/login')
        return
      }

      setUser(data.session.user)
      setLoading(false)

      // Fetch user uploads count
      supabase
        .from('uploads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', data.session.user.id)
        .then(({ count }) => {
          setUploadsCount(count || 0)
        })

      // Load bookmarks count from local storage
      try {
        const saved = JSON.parse(localStorage.getItem('healthhub_bookmarks') || '[]')
        setBookmarksCount(saved.length)
      } catch (e) {
        // ignore
      }
    })
  }, [router])

  async function handleLogout() {
    setLoggingOut(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Unable to sign out.', error)
      setLoggingOut(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  if (loading || !user) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-190px)] max-w-2xl items-center justify-center px-6 py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-brand-leaf" />
          <p className="text-sm font-medium text-brand-body">Loading your health profile...</p>
        </div>
      </section>
    )
  }

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recent Member'

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="space-y-8">
        {/* Profile Card Header */}
        <Card className="p-6 sm:p-10 border border-white/60 bg-white/70 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-brand-leaf/15">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-leaf to-brand-mint text-white font-bold text-2xl shadow-md">
                {(user.user_metadata?.name || user.email || 'U')[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-forest">
                    {user.user_metadata?.name || 'HealthHub Member'}
                  </h1>
                  <Badge variant="secondary" className="text-xs text-brand-forest font-semibold">
                    Verified
                  </Badge>
                </div>
                <p className="text-sm text-brand-body flex items-center gap-1.5 mt-1">
                  <Mail className="h-3.5 w-3.5 text-brand-leaf" /> {user.email}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-red-700 border-red-200 hover:bg-red-50 flex items-center gap-1.5 self-start sm:self-center"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="rounded-2xl border border-brand-leaf/20 bg-white/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-body">Saved Tips</span>
                <Bookmark className="h-4 w-4 text-brand-leaf" />
              </div>
              <p className="text-2xl font-black text-brand-forest mt-2">{bookmarksCount}</p>
              <Link
                href="/tips"
                className="text-xs font-semibold text-brand-leaf hover:underline mt-1 inline-flex items-center gap-1"
              >
                View bookmarks <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-brand-leaf/20 bg-white/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-body">Stored Reports</span>
                <UploadCloud className="h-4 w-4 text-brand-leaf" />
              </div>
              <p className="text-2xl font-black text-brand-forest mt-2">{uploadsCount}</p>
              <Link
                href="/upload"
                className="text-xs font-semibold text-brand-leaf hover:underline mt-1 inline-flex items-center gap-1"
              >
                Manage files <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-brand-leaf/20 bg-white/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-body">Account Since</span>
                <Calendar className="h-4 w-4 text-brand-leaf" />
              </div>
              <p className="text-lg font-bold text-brand-forest mt-2">{memberSince}</p>
              <span className="text-xs text-brand-body/70 mt-1 inline-block">Active Status</span>
            </div>
          </div>
        </Card>

        {/* Quick Hub Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="p-6 border border-white/60 bg-white/70 shadow-lg backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-brand-leaf" />
                <h3 className="text-lg font-bold text-brand-forest">Explore Health Library</h3>
              </div>
              <p className="text-sm text-brand-body leading-relaxed">
                Browse our verified hygiene guides covering food safety, microbial prevention,
                respiratory defense, and dental health.
              </p>
            </div>
            <Link href="/tips" className="mt-4">
              <Button variant="secondary" size="sm" className="w-full">
                Open Hygiene Tips →
              </Button>
            </Link>
          </Card>

          <Card className="p-6 border border-white/60 bg-white/70 shadow-lg backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-brand-leaf" />
                <h3 className="text-lg font-bold text-brand-forest">Daily Prevention Streak</h3>
              </div>
              <p className="text-sm text-brand-body leading-relaxed">
                Check off your 5 daily health habits on the homepage and measure your daily hygiene
                protection score.
              </p>
            </div>
            <Link href="/" className="mt-4">
              <Button size="sm" className="w-full">
                Go to Daily Check →
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  )
}
