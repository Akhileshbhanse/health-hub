'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthShell, Feedback } from '@/components/AuthShell'
import PasswordInput from '@/components/PasswordInput'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'

function friendlyError(message: string) {
  if (message.toLowerCase().includes('invalid login credentials')) {
    return 'That email or password is not correct. Please try again.'
  }
  return message || 'We could not log you in. Please try again.'
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, loading: sessionLoading } = useAuth()

  useEffect(() => {
    if (!sessionLoading && user) {
      router.replace('/account')
    }
  }, [router, sessionLoading, user])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) setError(friendlyError(signInError.message))
    else {
      router.push('/account')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <AuthShell title="Welcome back" description="Log in to continue to HealthHub.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Feedback tone="error">{error}</Feedback>}
        <label className="field-label" htmlFor="email">Email
          <div className="relative mt-2">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-leaf" aria-hidden="true">@</span>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@example.com" autoComplete="email" required />
          </div>
        </label>
        <label className="field-label" htmlFor="password">Password
          <div className="mt-2"><PasswordInput id="password" value={password} onChange={setPassword} autoComplete="current-password" /></div>
        </label>
        <div className="text-right">
          <Link href="/auth/forgot-password" className="text-sm font-semibold text-brand-forest underline-offset-4 hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="primary-button w-full">{loading ? 'Logging in...' : 'Log in'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-brand-body">New to HealthHub? <Link href="/auth/signup" className="font-semibold text-brand-forest hover:underline">Create an account</Link></p>
    </AuthShell>
  )
}
