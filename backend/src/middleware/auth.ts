import { NextFunction, Request, Response } from 'express'
import { adminSupabase } from '../supabase'

export type AuthenticatedRequest = Request & {
  user: { id: string; email?: string }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.header('Authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined

  if (!token) {
    res.status(401).json({ error: 'A valid bearer token is required' })
    return
  }

  const { data, error } = await adminSupabase.auth.getUser(token)
  if (error || !data.user) {
    res.status(401).json({ error: 'Invalid or expired access token' })
    return
  }

  ;(req as AuthenticatedRequest).user = {
    id: data.user.id,
    email: data.user.email,
  }
  next()
}
