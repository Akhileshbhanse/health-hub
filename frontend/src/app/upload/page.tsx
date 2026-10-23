'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, Upload } from '@/lib/supabase'
import Card from '@/components/Card'

export default function UploadPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [uploads, setUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [description, setDescription] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.push('/auth/login')
      return
    }

    setUser(session.user)
    await fetchUploads(session.user.id)
  }

  const fetchUploads = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setUploads(data || [])
    } catch (error) {
      console.error('Error fetching uploads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return

    const file = e.target.files[0]
    setUploading(true)

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('uploads').getPublicUrl(filePath)

      // Save to database
      const { error: dbError } = await supabase.from('uploads').insert({
        user_id: user.id,
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        description: description || null,
        file_path: filePath,
        storage_path: filePath,
      })

      if (dbError) throw dbError

      setDescription('')
      await fetchUploads(user.id)
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setUploading(false)
    }
  }

  const deleteUpload = async (uploadId: string, storagePath: string | null) => {
    if (!confirm('Are you sure you want to delete this upload?')) return

    if (!storagePath) {
      console.error('Cannot delete upload without a stored storage path.')
      return
    }

    try {
      const { error: storageError } = await supabase.storage.from('uploads').remove([storagePath])
      if (storageError) throw storageError

      // Delete from database
      const { error } = await supabase
        .from('uploads')
        .delete()
        .eq('id', uploadId)

      if (error) throw error

      setUploads((prev) => prev.filter((upload) => upload.id !== uploadId))
    } catch (error) {
      console.error('Error deleting upload:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-brand-leaf"></div>
        <p className="mt-4 text-brand-body">Loading uploads...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Upload Health Reports</h1>

        {/* Upload Form */}
        <Card className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upload New File</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Description (optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for this upload"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select File
              </label>
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                accept="image/*,.pdf,.doc,.docx"
                className="input-field"
              />
              <p className="mt-1 text-xs text-brand-body/70">
                Accepted formats: Images, PDF, Word documents (Max 10MB)
              </p>
            </div>

            {uploading && (
              <div className="text-center py-4">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-brand-leaf"></div>
                <p className="mt-2 text-sm text-brand-body">Uploading...</p>
              </div>
            )}
          </div>
        </Card>

        {/* Uploads List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Uploads</h2>

          {uploads.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-brand-body">
                  No uploads yet. Upload your first file above!
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {uploads.map((upload) => (
                <Card key={upload.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {upload.file_name}
                      </h3>
                      {upload.description && (
                        <p className="mb-2 text-sm text-brand-body">
                          {upload.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-brand-body/70">
                        <span>
                          📅{' '}
                          {new Date(upload.uploaded_at).toLocaleDateString()}
                        </span>
                        {upload.file_type && <span>📄 {upload.file_type}</span>}
                        {upload.file_size && (
                          <span>
                            💾 {(upload.file_size / 1024).toFixed(2)} KB
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <a
                        href={upload.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-brand-leaf hover:text-brand-forest"
                      >
                        View
                      </a>
                      <button
                        onClick={() => deleteUpload(upload.id, upload.storage_path)}
                        className="text-sm font-semibold text-red-700 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
