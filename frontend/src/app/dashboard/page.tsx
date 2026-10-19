'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, Recommendation } from '@/lib/supabase'
import Card from '@/components/Card'
import api from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUploads: 0,
    unreadRecommendations: 0,
    tipsViewed: 0,
  })

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
    await fetchDashboardData(session.user.id)
  }

  const fetchDashboardData = async (userId: string) => {
    try {
      // Fetch recommendations
      const { data: recsData } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)

      setRecommendations(recsData || [])

      // Fetch uploads count
      const { count: uploadsCount } = await supabase
        .from('uploads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      // Count unread recommendations
      const unreadCount =
        recsData?.filter((rec) => !rec.is_read).length || 0

      setStats({
        totalUploads: uploadsCount || 0,
        unreadRecommendations: unreadCount,
        tipsViewed: 0, // This would need to be tracked separately
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (recommendationId: string) => {
    try {
      await supabase
        .from('recommendations')
        .update({ is_read: true })
        .eq('id', recommendationId)

      setRecommendations((prev) =>
        prev.map((rec) =>
          rec.id === recommendationId ? { ...rec, is_read: true } : rec
        )
      )
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const generateRecommendations = async () => {
    if (!user) return

    try {
      await api.post('/api/recommendations/generate', { userId: user.id })
      await fetchDashboardData(user.id)
      alert('New recommendations generated!')
    } catch (error) {
      console.error('Error generating recommendations:', error)
      alert('Failed to generate recommendations')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Total Uploads
                </p>
                <p className="text-3xl font-bold text-primary-600">
                  {stats.totalUploads}
                </p>
              </div>
              <div className="text-4xl">📤</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Unread Recommendations
                </p>
                <p className="text-3xl font-bold text-secondary-600">
                  {stats.unreadRecommendations}
                </p>
              </div>
              <div className="text-4xl">💡</div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Tips Viewed
                </p>
                <p className="text-3xl font-bold text-primary-600">
                  {stats.tipsViewed}
                </p>
              </div>
              <div className="text-4xl">👁️</div>
            </div>
          </Card>
        </div>

        {/* Recommendations Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Recommendations</h2>
            <button
              onClick={generateRecommendations}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Generate New
            </button>
          </div>

          {recommendations.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No recommendations yet. Generate some to get started!
                </p>
                <button
                  onClick={generateRecommendations}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Generate Recommendations
                </button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <Card
                  key={rec.id}
                  className={rec.is_read ? 'opacity-60' : ''}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {rec.category && (
                          <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                            {rec.category}
                          </span>
                        )}
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            rec.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : rec.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200">
                        {rec.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(rec.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!rec.is_read && (
                      <button
                        onClick={() => markAsRead(rec.id)}
                        className="ml-4 text-sm text-primary-600 hover:text-primary-700"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">📚 Browse Tips</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Explore our collection of hygiene tips
            </p>
            <button
              onClick={() => router.push('/tips')}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              View All Tips →
            </button>
          </Card>

          <Card className="hover:shadow-lg transition cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">📤 Upload Reports</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Upload your health reports and images
            </p>
            <button
              onClick={() => router.push('/upload')}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Go to Upload →
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}
