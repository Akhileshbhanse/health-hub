'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')

    if (!code) {
      setError('This confirmation link is missing its code. Please request a new one.')
      return
    }

    supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
      if (exchangeError) {
        setError('We could not confirm your email. Please request a new confirmation link.')
        return
      }

      router.replace('/account')
      router.refresh()
    })
  }, [router])

  return (
    <section className="mx-auto flex min-h-[calc(100vh-190px)] max-w-lg items-center px-6 py-12">
      <div className="glass-card w-full p-8 text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-brand-forest">Confirmation failed</h1>
            <p className="mt-3 text-brand-body">{error}</p>
          </>
        ) : (
          <p className="text-brand-body">Confirming your email...</p>
        )}
      </div>
    </section>
  )
}
