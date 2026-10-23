import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import multer from 'multer'
import { randomUUID } from 'node:crypto'
import { config } from './config'
import { AuthenticatedRequest, requireAuth } from './middleware/auth'
import { adminSupabase, publicSupabase } from './supabase'

const app = express()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileSize },
})

app.use(helmet())
app.use(cors({ origin: config.frontendUrl }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan('combined'))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'health-hub-api' })
})

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body
    if (typeof email !== 'string' || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'Email and a password of at least 6 characters are required' })
      return
    }

    const { data, error } = await publicSupabase.auth.signUp({
      email,
      password,
      options: { data: { name: typeof name === 'string' ? name.trim() : '' } },
    })
    if (error) {
      res.status(400).json({ error: error.message })
      return
    }
    res.status(201).json({ user: data.user, session: data.session })
  } catch (error) {
    next(error)
  }
})

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }
    const { data, error } = await publicSupabase.auth.signInWithPassword({ email, password })
    if (error) {
      res.status(401).json({ error: error.message })
      return
    }
    res.json({ user: data.user, session: data.session })
  } catch (error) {
    next(error)
  }
})

app.get('/api/tips', async (req, res, next) => {
  try {
    let query = adminSupabase.from('tips').select('*').order('is_featured', { ascending: false }).order('created_at', { ascending: false })
    if (typeof req.query.category === 'string' && req.query.category !== 'all') {
      query = query.eq('category', req.query.category)
    }
    const { data, error } = await query
    if (error) throw error
    res.json({ tips: data })
  } catch (error) {
    next(error)
  }
})

app.get('/api/tips/:id', async (req, res, next) => {
  try {
    const { data, error } = await adminSupabase.from('tips').select('*').eq('id', req.params.id).single()
    if (error) {
      res.status(404).json({ error: 'Tip not found' })
      return
    }
    res.json({ tip: data })
  } catch (error) {
    next(error)
  }
})

app.get('/api/uploads', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id
    const { data, error } = await adminSupabase.from('uploads').select('*').eq('user_id', userId).order('uploaded_at', { ascending: false })
    if (error) throw error
    res.json({ uploads: data })
  } catch (error) {
    next(error)
  }
})

app.post('/api/uploads', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file
    if (!file) {
      res.status(400).json({ error: 'A file is required' })
      return
    }
    const userId = (req as AuthenticatedRequest).user.id
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${userId}/${randomUUID()}-${safeName}`
    const { error: storageError } = await adminSupabase.storage.from(config.storageBucket).upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    })
    if (storageError) throw storageError

    const { data: urlData } = adminSupabase.storage.from(config.storageBucket).getPublicUrl(path)
    const { data, error } = await adminSupabase.from('uploads').insert({
      user_id: userId,
      file_name: file.originalname,
      file_url: urlData.publicUrl,
      file_type: file.mimetype,
      file_size: file.size,
      file_path: path,
      description: typeof req.body.description === 'string' ? req.body.description.trim() : null,
    }).select().single()
    if (error) throw error
    res.status(201).json({ upload: data })
  } catch (error) {
    next(error)
  }
})

app.delete('/api/uploads/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id
    const { data: record, error: findError } = await adminSupabase.from('uploads').select('file_path').eq('id', req.params.id).eq('user_id', userId).single()
    if (findError || !record) {
      res.status(404).json({ error: 'Upload not found' })
      return
    }
    const { error: storageError } = await adminSupabase.storage.from(config.storageBucket).remove([record.file_path])
    if (storageError) throw storageError
    const { error } = await adminSupabase.from('uploads').delete().eq('id', req.params.id).eq('user_id', userId)
    if (error) throw error
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

app.get('/api/recommendations', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id
    const { data, error } = await adminSupabase.from('recommendations').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20)
    if (error) throw error
    res.json({ recommendations: data })
  } catch (error) {
    next(error)
  }
})

app.post('/api/recommendations/generate', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id
    const content = 'Keep a consistent handwashing routine, clean frequently touched surfaces, and review the latest hygiene tips this week.'
    const { data, error } = await adminSupabase.from('recommendations').insert({
      user_id: userId,
      content,
      category: 'Personal Hygiene',
      priority: 'medium',
    }).select().single()
    if (error) throw error
    res.status(201).json({ recommendation: data, source: 'rule-based-placeholder' })
  } catch (error) {
    next(error)
  }
})

app.post('/api/ai/analyze', requireAuth, (_req, res) => {
  res.status(501).json({
    error: 'AI analysis is not enabled yet',
    message: 'This endpoint is reserved for future report and image analysis.',
  })
})

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error)
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({ error: `Files must be smaller than ${config.maxFileSize / 1024 / 1024}MB` })
    return
  }
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(config.port, () => {
  console.log(`HealthHub API listening on port ${config.port}`)
})
