'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthShell, Feedback } from '@/components/AuthShell'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (resetError) setError(resetError.message || 'We could not send the reset email.')
    else setMessage('Check your inbox for a password reset link.')
    setLoading(false)
  }

  return (
    <AuthShell title="Reset your password" description="We will email you a secure link to choose a new password.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Feedback tone="error">{error}</Feedback>}
        {message && <Feedback tone="success">{message}</Feedback>}
        <label className="field-label" htmlFor="email">Email
          <div className="relative mt-2"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-leaf" aria-hidden="true">@</span><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@example.com" autoComplete="email" required /></div>
        </label>
        <button type="submit" disabled={loading} className="primary-button w-full">{loading ? 'Sending...' : 'Send reset link'}</button>
      </form>
      <p className="mt-6 text-center text-sm"><Link href="/auth/login" className="font-semibold text-brand-forest hover:underline">Back to log in</Link></p>
    </AuthShell>
  )
}
