'use client'

import { useEffect, useState } from 'react'
import { supabase, Tip } from '@/lib/supabase'
import Card from '@/components/Card'

export default function TipsPage() {
  const [tips, setTips] = useState<Tip[]>([])
  const [filteredTips, setFilteredTips] = useState<Tip[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  const categories = [
    'all',
    'Personal Hygiene',
    'Dental Health',
    'Food Hygiene',
    'Environmental Health',
    'Home Hygiene',
    'Health Protection',
  ]

  useEffect(() => {
    fetchTips()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredTips(tips)
    } else {
      setFilteredTips(tips.filter((tip) => tip.category === selectedCategory))
    }
  }, [selectedCategory, tips])

  const fetchTips = async () => {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setTips(data || [])
      setFilteredTips(data || [])
    } catch (error) {
      console.error('Error fetching tips:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading tips...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Hygiene Tips & Best Practices</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Curated health and hygiene tips to keep you healthy
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={clsx(
                  'px-4 py-2 rounded-lg font-medium transition',
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Tips Grid */}
        {filteredTips.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No tips found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTips.map((tip) => (
              <Card key={tip.id} className="hover:shadow-lg transition">
                {tip.is_featured && (
                  <div className="mb-2">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                      ⭐ Featured
                    </span>
                  </div>
                )}
                <div className="mb-2">
                  <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                    {tip.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{tip.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {tip.description}
                </p>
                {tip.content && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 border-t pt-4">
                    {tip.content}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>👁️ {tip.views} views</span>
                  {tip.author && <span>By {tip.author}</span>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
