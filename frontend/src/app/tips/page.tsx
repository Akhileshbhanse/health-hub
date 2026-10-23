'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { INITIAL_TIPS, type HealthTip } from '@/lib/tipsData'
import {
  Search,
  Sparkles,
  Bookmark,
  Clock,
  Eye,
  Filter,
  ArrowRight,
  ShieldCheck,
  Flame,
  CheckCircle,
} from 'lucide-react'

export default function TipsPage() {
  const [tips, setTips] = useState<HealthTip[]>(INITIAL_TIPS)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTab, setSelectedTab] = useState<'all' | 'featured' | 'saved'>('all')
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])

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
    // Load local bookmarks
    try {
      const saved = JSON.parse(localStorage.getItem('healthhub_bookmarks') || '[]')
      setBookmarkedIds(saved)
    } catch (e) {
      // ignore
    }

    // Fetch tips from Supabase and merge
    async function loadTips() {
      try {
        const { data, error } = await supabase
          .from('tips')
          .select('*')
          .order('is_featured', { ascending: false })

        if (!error && data && data.length > 0) {
          // Merge data from database with local rich dataset (matching by title or id)
          const merged: HealthTip[] = [...INITIAL_TIPS]
          data.forEach((dbTip) => {
            const existingIdx = merged.findIndex(
              (m) => m.id === dbTip.id || m.title.toLowerCase() === dbTip.title.toLowerCase()
            )
            if (existingIdx !== -1) {
              merged[existingIdx] = {
                ...merged[existingIdx],
                ...dbTip,
              }
            } else {
              merged.push({
                id: dbTip.id,
                title: dbTip.title,
                description: dbTip.description,
                category: dbTip.category,
                content: dbTip.content || '',
                is_featured: !!dbTip.is_featured,
                views: dbTip.views || 0,
                author: dbTip.author || 'HealthHub Medical Editorial',
                readTime: '3 min read',
                level: 'Essential',
                tags: [dbTip.category],
              })
            }
          })
          setTips(merged)
        }
      } catch (err) {
        console.warn('Using built-in tips dataset:', err)
      } finally {
        setLoading(false)
      }
    }

    loadTips()
  }, [])

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    let updated: string[]
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter((item) => item !== id)
    } else {
      updated = [...bookmarkedIds, id]
    }
    setBookmarkedIds(updated)
    try {
      localStorage.setItem('healthhub_bookmarks', JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  // Filtered and searched tips
  const filteredTips = useMemo(() => {
    return tips.filter((tip) => {
      // Tab filter
      if (selectedTab === 'featured' && !tip.is_featured) return false
      if (selectedTab === 'saved' && !bookmarkedIds.includes(tip.id)) return false

      // Category filter
      if (selectedCategory !== 'all' && tip.category !== selectedCategory) {
        return false
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const matchesTitle = tip.title.toLowerCase().includes(query)
        const matchesDesc = tip.description.toLowerCase().includes(query)
        const matchesContent = tip.content?.toLowerCase().includes(query)
        const matchesTag = tip.tags?.some((t) => t.toLowerCase().includes(query))
        return matchesTitle || matchesDesc || matchesContent || matchesTag
      }

      return true
    })
  }, [tips, selectedCategory, selectedTab, searchQuery, bookmarkedIds])

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <Badge variant="secondary" className="mb-3 px-3 py-1 font-semibold text-brand-forest">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-brand-leaf inline" />
          Evidence-Based Health & Hygiene Guides
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-brand-forest">
          Hygiene Wisdom & Daily Practices
        </h1>
        <p className="mt-4 text-base sm:text-lg text-brand-body leading-relaxed">
          Comprehensive, actionable hygiene protocols designed to protect your immunity,
          living space, nutrition, and everyday wellness.
        </p>
      </div>

      {/* Control Bar: Search & View Tabs */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-body/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hygiene tips, techniques, germs, habits..."
            className="input-field pl-10 pr-4 py-2.5 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-body/60 hover:text-brand-forest"
            >
              Clear
            </button>
          )}
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-white/50 p-1.5 border border-brand-leaf/20 backdrop-blur-md">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedTab === 'all'
                ? 'bg-brand-leaf text-white shadow-sm'
                : 'text-brand-body hover:text-brand-forest'
            }`}
          >
            All Tips ({tips.length})
          </button>
          <button
            onClick={() => setSelectedTab('featured')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedTab === 'featured'
                ? 'bg-brand-leaf text-white shadow-sm'
                : 'text-brand-body hover:text-brand-forest'
            }`}
          >
            <Sparkles className="h-3 w-3" /> Featured
          </button>
          <button
            onClick={() => setSelectedTab('saved')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedTab === 'saved'
                ? 'bg-brand-leaf text-white shadow-sm'
                : 'text-brand-body hover:text-brand-forest'
            }`}
          >
            <Bookmark className="h-3 w-3" /> Saved ({bookmarkedIds.length})
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mb-10 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategory === category
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-brand-forest text-white shadow-md'
                    : 'bg-white/60 text-brand-body hover:bg-white/90 border border-brand-leaf/20'
                }`}
              >
                {category === 'all' ? '✦ All Categories' : category}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tips Grid */}
      {filteredTips.length === 0 ? (
        <Card className="text-center py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-pale text-brand-forest mb-4">
            <Filter className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-brand-forest">No matching health tips found</h3>
          <p className="mt-2 text-sm text-brand-body max-w-md mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-5"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSelectedTab('all')
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip) => {
            const isSaved = bookmarkedIds.includes(tip.id)
            return (
              <Link
                key={tip.id}
                href={`/tips/${tip.id}`}
                className="group flex flex-col focus:outline-none focus:ring-2 focus:ring-brand-leaf focus:ring-offset-2 rounded-3xl"
              >
                <Card className="flex flex-col h-full justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-leaf/40 border border-white/60 bg-white/60 backdrop-blur-md p-6">
                  <div>
                    {/* Top Badges & Bookmark */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
                          {tip.category}
                        </span>
                        {tip.is_featured && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            <Sparkles className="h-2.5 w-2.5" /> Featured
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(e, tip.id)}
                        className="rounded-full p-1.5 text-brand-body/60 hover:text-brand-forest hover:bg-brand-pale/50 transition-colors"
                        title={isSaved ? 'Remove bookmark' : 'Bookmark this tip'}
                      >
                        <Bookmark
                          className={`h-4 w-4 ${isSaved ? 'fill-brand-leaf text-brand-leaf' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-brand-forest group-hover:text-brand-leaf transition-colors leading-snug mb-2">
                      {tip.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-brand-body line-clamp-3 leading-relaxed">
                      {tip.description}
                    </p>
                  </div>

                  {/* Card Footer Info */}
                  <div className="mt-6 pt-4 border-t border-brand-leaf/15 flex items-center justify-between text-xs text-brand-body/75">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-brand-leaf" />
                      {tip.readTime || '2 min read'}
                    </span>
                    <span className="flex items-center gap-1 text-brand-leaf font-semibold group-hover:translate-x-0.5 transition-transform">
                      Read Guide <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
