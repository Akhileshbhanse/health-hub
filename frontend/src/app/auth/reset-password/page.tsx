'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthShell, Feedback } from '@/components/AuthShell'
import PasswordInput from '@/components/PasswordInput'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) return setError('Use at least 8 characters with at least one letter and one number.')
    if (password !== confirmPassword) return setError('Passwords do not match.')
    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) setError(updateError.message || 'We could not update your password.')
    else router.push('/auth/login?reset=success')
    setLoading(false)
  }

  return (
    <AuthShell title="Choose a new password" description="Make it strong and easy for you to remember.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Feedback tone="error">{error}</Feedback>}
        <label className="field-label" htmlFor="password">New password
          <div className="mt-2"><PasswordInput id="password" value={password} onChange={setPassword} autoComplete="new-password" /></div>
        </label>
        <label className="field-label" htmlFor="confirm-password">Confirm new password
          <div className="mt-2"><PasswordInput id="confirm-password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" /></div>
        </label>
        <button type="submit" disabled={loading} className="primary-button w-full">{loading ? 'Updating...' : 'Update password'}</button>
      </form>
    </AuthShell>
  )
}
