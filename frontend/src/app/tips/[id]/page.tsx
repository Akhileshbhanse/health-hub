'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { INITIAL_TIPS, type HealthTip } from '@/lib/tipsData'
import { ArrowLeft, Bookmark, CheckCircle2, Clock, Eye, Share2, Sparkles, User } from 'lucide-react'

export default function TipDetailPage() {
  const params = useParams<{ id: string }>()
  const [tip, setTip] = useState<HealthTip | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!params.id) return

    async function loadTip() {
      // First check local initial dataset
      const localMatch = INITIAL_TIPS.find((t) => t.id === params.id)
      
      try {
        const { data, error } = await supabase
          .from('tips')
          .select('*')
          .eq('id', params.id)
          .single()

        if (data && !error) {
          setTip({
            id: data.id,
            title: data.title,
            description: data.description,
            category: data.category,
            content: data.content,
            is_featured: !!data.is_featured,
            views: (data.views || 0) + 1,
            author: data.author || localMatch?.author || 'HealthHub Expert Panel',
            readTime: localMatch?.readTime || '3 min read',
            level: localMatch?.level || 'Essential',
            tags: localMatch?.tags || [data.category],
          })

          // Increment view count in Supabase
          supabase
            .from('tips')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', data.id)
            .then(() => {})
        } else if (localMatch) {
          setTip(localMatch)
        }
      } catch (err) {
        if (localMatch) {
          setTip(localMatch)
        }
      } finally {
        setLoading(false)
      }
    }

    loadTip()

    // Check bookmark state
    try {
      const saved = JSON.parse(localStorage.getItem('healthhub_bookmarks') || '[]')
      setIsBookmarked(saved.includes(params.id))
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [params.id])

  const toggleBookmark = () => {
    if (!tip) return
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('healthhub_bookmarks') || '[]')
      let next: string[]
      if (saved.includes(tip.id)) {
        next = saved.filter((id) => id !== tip.id)
        setIsBookmarked(false)
      } else {
        next = [...saved, tip.id]
        setIsBookmarked(true)
      }
      localStorage.setItem('healthhub_bookmarks', JSON.stringify(next))
    } catch (e) {
      console.error(e)
    }
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-190px)] max-w-3xl items-center justify-center px-6 py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-brand-leaf" />
          <p className="text-sm font-medium text-brand-body">Loading health guide...</p>
        </div>
      </section>
    )
  }

  if (!tip) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-190px)] max-w-3xl items-center justify-center px-6 py-12">
        <Card className="w-full text-center py-12">
          <h1 className="text-3xl font-bold text-brand-forest">Tip Not Found</h1>
          <p className="mt-3 text-brand-body">
            This health tip may have moved or is temporarily unavailable.
          </p>
          <Link href="/tips" className="inline-block mt-6">
            <Button>Explore All Tips</Button>
          </Link>
        </Card>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/tips"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-leaf hover:text-brand-forest transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to tips
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleBookmark}
            className="flex items-center gap-1.5"
          >
            <Bookmark
              className={`h-4 w-4 ${isBookmarked ? 'fill-brand-leaf text-brand-leaf' : ''}`}
            />
            {isBookmarked ? 'Saved' : 'Save'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-1.5"
          >
            <Share2 className="h-4 w-4" />
            {copied ? 'Copied Link!' : 'Share'}
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border border-white/60 bg-white/70 shadow-xl backdrop-blur-xl p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="secondary" className="font-medium text-brand-forest">
            {tip.category}
          </Badge>
          {tip.is_featured && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-300 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Featured Guide
            </Badge>
          )}
          {tip.level && (
            <Badge variant="outline" className="border-brand-leaf/40 text-brand-forest">
              {tip.level}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-forest">
          {tip.title}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-brand-body font-medium">
          {tip.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-brand-body/75 pb-6 border-b border-brand-leaf/15">
          {tip.author && (
            <span className="flex items-center gap-1.5 font-medium text-brand-forest">
              <User className="h-3.5 w-3.5 text-brand-leaf" /> {tip.author}
            </span>
          )}
          {tip.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand-leaf" /> {tip.readTime}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-brand-leaf" /> {tip.views} reads
          </span>
        </div>

        {tip.content && (
          <div className="mt-8 space-y-4 text-brand-forest leading-relaxed text-base">
            {tip.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-wrap leading-7">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {tip.tags && tip.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-brand-leaf/15">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-leaf mb-2">
              Related Topics
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tip.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-brand-pale/60 px-2.5 py-1 text-xs font-medium text-brand-forest"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Helpful Actions Footer */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-brand-pale/40 to-white/60 p-5 border border-brand-leaf/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-brand-leaf shrink-0" />
            <div>
              <p className="font-semibold text-brand-forest text-sm">
                Apply this hygiene practice today
              </p>
              <p className="text-xs text-brand-body">
                Consistency turns simple actions into lifelong immune defenses.
              </p>
            </div>
          </div>
          <Link href="/tips">
            <Button size="sm" variant="secondary">
              Browse More Tips
            </Button>
          </Link>
        </div>
      </Card>
    </section>
  )
}
