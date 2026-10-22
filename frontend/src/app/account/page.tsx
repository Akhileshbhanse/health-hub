'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/Card'
import { useAuth } from '@/components/AuthProvider'

export default function AccountPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) router.replace('/auth/login')
  }, [loading, router, user])

  if (loading || !user) {
    return <section className="mx-auto max-w-2xl px-6 py-24 text-center text-brand-body">Checking your account...</section>
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-190px)] max-w-2xl items-center px-6 py-12">
      <Card className="w-full">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-leaf">Your account</p>
        <h1 className="mt-3 text-3xl font-bold text-brand-forest">Welcome, {user.user_metadata?.name || 'there'}.</h1>
        <p className="mt-4 text-brand-body">You are signed in as <span className="font-semibold">{user.email}</span>.</p>
      </Card>
    </section>
  )
}
