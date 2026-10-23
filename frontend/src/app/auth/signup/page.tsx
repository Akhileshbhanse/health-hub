'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthShell, Feedback } from '@/components/AuthShell'
import PasswordInput from '@/components/PasswordInput'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'

function passwordScore(password: string) {
  return [password.length >= 8, /[A-Za-z]/.test(password), /\d/.test(password)].filter(Boolean).length
}

export default function SignupPage() {
  const router = useRouter()
  const { user, loading: sessionLoading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const score = useMemo(() => passwordScore(password), [password])

  useEffect(() => {
    if (!sessionLoading && user) {
      router.replace('/account')
    }
  }, [router, sessionLoading, user])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (password !== confirmPassword) return setError('Passwords do not match.')
    if (score < 3) return setError('Use at least 8 characters with at least one letter and one number.')
    setLoading(true)
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (signUpError) setError(signUpError.message || 'We could not create your account.')
    else setMessage('Your account is ready. Check your email to confirm your address before logging in.')
    setLoading(false)
  }

  return (
    <AuthShell title="Create your account" description="A simple, secure place to manage your HealthHub access.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Feedback tone="error">{error}</Feedback>}
        <label className="field-label" htmlFor="name">Name
          <div className="relative mt-2"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-leaf" aria-hidden="true">◦</span><input id="name" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-10" placeholder="Your name" autoComplete="name" required /></div>
        </label>
        <label className="field-label" htmlFor="email">Email
          <div className="relative mt-2"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-leaf" aria-hidden="true">@</span><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@example.com" autoComplete="email" required /></div>
        </label>
        <label className="field-label" htmlFor="password">Password
          <div className="mt-2"><PasswordInput id="password" value={password} onChange={setPassword} autoComplete="new-password" /></div>
        </label>
        <div aria-live="polite" className="space-y-2 text-xs text-brand-body">
          <div className="flex gap-1" aria-label={`Password strength ${score} of 3`}>
            {[1, 2, 3].map((level) => <span key={level} className={`h-1.5 flex-1 rounded-full ${level <= score ? 'bg-brand-leaf' : 'bg-brand-body/15'}`} />)}
          </div>
          <p>Use 8+ characters, one letter, and one number.</p>
        </div>
        <label className="field-label" htmlFor="confirm-password">Confirm password
          <div className="mt-2"><PasswordInput id="confirm-password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" placeholder="Repeat your password" /></div>
        </label>
        <button type="submit" disabled={loading} className="primary-button w-full">{loading ? 'Creating account...' : 'Sign up'}</button>
      </form>
      {message && <div className="mt-5"><Feedback tone="success">{message}</Feedback></div>}
      <p className="mt-6 text-center text-sm text-brand-body">Already have an account? <Link href="/auth/login" className="font-semibold text-brand-forest hover:underline">Log in</Link></p>
    </AuthShell>
  )
}
