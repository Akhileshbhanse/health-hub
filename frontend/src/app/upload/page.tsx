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
      })

      if (dbError) throw dbError

      alert('File uploaded successfully!')
      setDescription('')
      await fetchUploads(user.id)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const deleteUpload = async (uploadId: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this upload?')) return

    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/')
      const filePath = `${user.id}/${urlParts[urlParts.length - 1]}`

      // Delete from storage
      await supabase.storage.from('uploads').remove([filePath])

      // Delete from database
      const { error } = await supabase
        .from('uploads')
        .delete()
        .eq('id', uploadId)

      if (error) throw error

      setUploads((prev) => prev.filter((upload) => upload.id !== uploadId))
      alert('Upload deleted successfully!')
    } catch (error) {
      console.error('Error deleting upload:', error)
      alert('Failed to delete upload')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading uploads...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800"
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: Images, PDF, Word documents (Max 10MB)
              </p>
            </div>

            {uploading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Uploading...</p>
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
                <p className="text-gray-600 dark:text-gray-400">
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
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {upload.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
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
                        className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                      >
                        View
                      </a>
                      <button
                        onClick={() => deleteUpload(upload.id, upload.file_url)}
                        className="text-red-600 hover:text-red-700 text-sm font-semibold"
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
