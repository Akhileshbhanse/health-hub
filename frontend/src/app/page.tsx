'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GlyphPortal } from '@/components/ui/glyph-portal'
import { INITIAL_TIPS, type HealthTip } from '@/lib/tipsData'
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Timer,
  Droplets,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  HeartHandshake,
  Award,
  ChevronRight,
  RotateCcw,
  Play,
  Pause,
  UploadCloud,
  Smile,
} from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()

  // Daily Habits state (persisted locally)
  const defaultHabits = [
    { id: 'water', label: 'Hydrate: Drink 8 glasses of pure water', done: false, icon: '💧' },
    { id: 'hands', label: '20-second antibacterial handwash before meals', done: false, icon: '🧼' },
    { id: 'dental', label: '2-minute dental brushing + flossing', done: false, icon: '🪥' },
    { id: 'air', label: '15-minute cross-ventilation in room', done: false, icon: '🌬️' },
    { id: 'tech', label: 'Disinfect smartphone screen with alcohol wipe', done: false, icon: '📱' },
  ]
  const [habits, setHabits] = useState(defaultHabits)

  // 20-second handwashing timer state
  const [timerSeconds, setTimerSeconds] = useState(20)
  const [timerActive, setTimerActive] = useState(false)

  // Quick Hygiene Quiz state
  const [quizStep, setQuizStep] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)

  // Featured tips list
  const featuredTips = INITIAL_TIPS.filter((t) => t.is_featured).slice(0, 3)

  // Load habits from localStorage
  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const savedHabits = localStorage.getItem(`healthhub_habits_${today}`)
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits))
      }
    } catch (e) {
      // ignore
    }
  }, [])

  // Save habits
  const toggleHabit = (id: string) => {
    const updated = habits.map((h) => (h.id === id ? { ...h, done: !h.done } : h))
    setHabits(updated)
    try {
      const today = new Date().toISOString().slice(0, 10)
      localStorage.setItem(`healthhub_habits_${today}`, JSON.stringify(updated))
    } catch (e) {
      // ignore
    }
  }

  // Handwash timer effect
  useEffect(() => {
    let interval: any = null
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1)
      }, 1000)
    } else if (timerSeconds === 0) {
      setTimerActive(false)
    }
    return () => clearInterval(interval)
  }, [timerActive, timerSeconds])

  const resetTimer = () => {
    setTimerActive(false)
    setTimerSeconds(20)
  }

  // Quiz questions
  const quizQuestions = [
    {
      q: 'How long do you scrub your hands with soap under running water?',
      options: [
        { text: 'Less than 10 seconds', points: 10 },
        { text: 'Around 10 to 15 seconds', points: 20 },
        { text: 'Full 20 seconds or more (thoroughly)', points: 30 },
      ],
    },
    {
      q: 'How frequently do you wash or swap your bedsheets & pillowcases?',
      options: [
        { text: 'Once a month or less', points: 10 },
        { text: 'Every 2-3 weeks', points: 20 },
        { text: 'Weekly or every 5-7 days', points: 30 },
      ],
    },
    {
      q: 'Do you disinfect your smartphone screen regularly?',
      options: [
        { text: 'Never or rarely', points: 10 },
        { text: 'Once every few weeks', points: 20 },
        { text: 'Daily or multiple times weekly', points: 30 },
      ],
    },
  ]

  const handleQuizAnswer = (points: number) => {
    const nextScore = quizScore + points
    setQuizScore(nextScore)
    if (quizStep + 1 < quizQuestions.length) {
      setQuizStep(quizStep + 1)
    } else {
      setQuizDone(true)
    }
  }

  const resetQuiz = () => {
    setQuizStep(0)
    setQuizScore(0)
    setQuizDone(false)
  }

  const completedHabitsCount = habits.filter((h) => h.done).length
  const habitPercentage = Math.round((completedHabitsCount / habits.length) * 100)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Interactive Glyph Portal Hero Section */}
      <GlyphPortal
        word="HEALTH"
        focusChar="H"
        scrollLength={1.8}
        interactive={true}
        annotations={true}
        enterLabel="Step Inside HealthHub"
        front={
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-leaf/30 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-forest shadow-sm backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-brand-leaf" />
              Scientific Hygiene & Everyday Vitality
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-brand-forest">
              A calmer, wiser way to care for your body.
            </h1>
            <p className="mx-auto max-w-xl text-sm sm:text-base text-brand-body font-medium">
              Transform daily routines into lifelong health shields. Clean environments,
              evidence-based hygiene, and personalized wellness habits.
            </p>
          </div>
        }
      >
        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-leaf">
              ✦ The HealthHub Framework
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-forest mt-1">
              Three Pillars of Daily Prevention
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-brand-leaf/20 bg-white/50 p-6 hover:bg-white/80 transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-pale text-brand-forest font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-brand-forest mb-2">Microbial Defense</h3>
              <p className="text-xs sm:text-sm text-brand-body leading-relaxed">
                Evidence-based handwashing techniques, surface dwell times, and touchpoint
                sanitization to eliminate viral transmission.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-leaf/20 bg-white/50 p-6 hover:bg-white/80 transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-pale text-brand-forest font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-brand-forest mb-2">Living Environment</h3>
              <p className="text-xs sm:text-sm text-brand-body leading-relaxed">
                Cross-ventilation protocols, dust-mite bedding cycles, and kitchen
                cross-contamination barriers for pristine living spaces.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-leaf/20 bg-white/50 p-6 hover:bg-white/80 transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-pale text-brand-forest font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-brand-forest mb-2">Habit Consistency</h3>
              <p className="text-xs sm:text-sm text-brand-body leading-relaxed">
                Track daily hygiene streaks, test your personal hygiene index, and cultivate
                effortless automatic wellness routines.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/tips">
              <Button size="lg" className="rounded-2xl px-8 shadow-lg shadow-brand-leaf/20">
                Explore All 18+ Hygiene Guides <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </GlyphPortal>

      {/* Main Interactive Hub Container */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        {/* Personalized Welcome Banner if Logged In */}
        {!loading && user && (
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-r from-brand-pale/50 via-white/70 to-brand-cream/80 p-6 sm:p-8 shadow-lg backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-leaf/20 px-3 py-1 text-xs font-bold text-brand-forest mb-2">
                  <Smile className="h-3.5 w-3.5 text-brand-leaf" /> Active HealthHub Member
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-forest">
                  Welcome back, {user.user_metadata?.name || user.email?.split('@')[0]}! 🌱
                </h2>
                <p className="text-sm text-brand-body mt-1 max-w-xl">
                  Your daily hygiene and wellness command center. Check off today’s habits and stay
                  ahead of seasonal pathogens.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/tips">
                  <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-brand-leaf" /> Browse Guides
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button size="sm" className="flex items-center gap-1.5">
                    <UploadCloud className="h-4 w-4" /> Upload Health Files
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Two-Column Grid: Daily Habits Tracker & Handwash Timer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Habit Checklist (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 sm:p-8 border border-white/60 bg-white/70 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-brand-leaf" />
                    <h3 className="text-xl font-bold text-brand-forest">Daily Hygiene Streak</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-body mt-0.5">
                    Complete your daily prevention habits to build unbreakable immunity.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-brand-forest">
                    {completedHabitsCount}/{habits.length}
                  </span>
                  <p className="text-[11px] font-semibold text-brand-leaf">{habitPercentage}% Done</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-brand-pale/60 h-3 rounded-full overflow-hidden mb-6 border border-brand-leaf/20">
                <div
                  className="bg-gradient-to-r from-brand-leaf to-brand-mint h-full transition-all duration-500 rounded-full"
                  style={{ width: `${habitPercentage}%` }}
                />
              </div>

              {/* Habit Checklist items */}
              <div className="space-y-3">
                {habits.map((habit) => (
                  <button
                    key={habit.id}
                    type="button"
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-full text-left flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      habit.done
                        ? 'bg-brand-pale/40 border-brand-leaf/40 text-brand-forest shadow-sm'
                        : 'bg-white/50 border-white/80 hover:bg-white/80 text-brand-body'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{habit.icon}</span>
                      <span
                        className={`text-sm font-semibold ${
                          habit.done ? 'line-through text-brand-body/60' : 'text-brand-forest'
                        }`}
                      >
                        {habit.label}
                      </span>
                    </div>
                    {habit.done ? (
                      <CheckCircle2 className="h-5 w-5 text-brand-leaf shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-brand-body/40 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {habitPercentage === 100 && (
                <div className="mt-6 rounded-2xl bg-gradient-to-r from-brand-leaf/15 to-brand-mint/20 p-4 border border-brand-leaf/30 text-center animate-fade-in">
                  <p className="font-bold text-brand-forest text-sm flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-leaf" /> Perfect Day! All hygiene targets
                    achieved.
                  </p>
                  <p className="text-xs text-brand-body mt-1">
                    Your proactive defenses are operating at peak efficiency!
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Interactive Tools: 20s Handwash Timer */}
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 border border-white/60 bg-white/70 shadow-xl backdrop-blur-xl flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-brand-leaf" />
                    <h3 className="text-lg font-bold text-brand-forest">20s Handwash Guide</h3>
                  </div>
                  <Badge variant="outline" className="text-xs text-brand-leaf border-brand-leaf/40">
                    WHO Standard
                  </Badge>
                </div>
                <p className="text-xs text-brand-body leading-relaxed mb-6">
                  Washing hands for 20 seconds with friction removes 100x more viral particles than a
                  quick 5-second rinse.
                </p>

                {/* Animated Timer Circle */}
                <div className="relative flex flex-col items-center justify-center my-6">
                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-brand-pale bg-white/80 shadow-inner">
                    <div
                      className="absolute inset-0 rounded-full border-4 border-brand-leaf transition-all duration-1000"
                      style={{
                        clipPath: `inset(0 0 ${100 - (timerSeconds / 20) * 100}% 0)`,
                      }}
                    />
                    <div className="text-center">
                      <span className="text-4xl font-black text-brand-forest tracking-tight">
                        {timerSeconds}
                      </span>
                      <span className="block text-[11px] font-bold uppercase text-brand-leaf">
                        Seconds
                      </span>
                    </div>
                  </div>

                  {/* Active Instruction Step */}
                  <p className="mt-4 text-center text-xs font-semibold text-brand-forest h-6">
                    {timerSeconds > 15
                      ? '1. Lather palms & wrists with soap'
                      : timerSeconds > 10
                      ? '2. Scrub between fingers & thumbs'
                      : timerSeconds > 5
                      ? '3. Clean fingernails & backs of hands'
                      : timerSeconds > 0
                      ? '4. Rinse thoroughly with clean water'
                      : '✨ Done! Dry hands completely.'}
                  </p>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-2 mt-4">
                <Button
                  onClick={() => setTimerActive(!timerActive)}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  {timerActive ? (
                    <>
                      <Pause className="h-4 w-4" /> Pause
                    </>
                  ) : timerSeconds === 0 ? (
                    <>
                      <RotateCcw className="h-4 w-4" /> Start Again
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" /> Start Timer
                    </>
                  )}
                </Button>
                <Button variant="secondary" size="icon" onClick={resetTimer} title="Reset">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Hygiene Index Assessment */}
        <Card className="p-6 sm:p-10 border border-white/60 bg-gradient-to-br from-white/80 via-white/60 to-brand-pale/30 shadow-xl backdrop-blur-xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-leaf/20 px-3 py-1 text-xs font-bold text-brand-forest mb-3">
              <Award className="h-3.5 w-3.5 text-brand-leaf" />
              Interactive Hygiene Assessment
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-forest">
              What is your personal Hygiene Protection Index?
            </h3>
            <p className="text-sm text-brand-body mt-2 leading-relaxed">
              Take this 30-second science-backed check to discover blind spots in your daily
              hygiene and environmental defense.
            </p>

            {!quizDone ? (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-brand-leaf">
                  <span>Question {quizStep + 1} of {quizQuestions.length}</span>
                  <span>{Math.round(((quizStep + 1) / quizQuestions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-brand-pale/50 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-leaf h-full transition-all duration-300"
                    style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
                <h4 className="text-lg font-bold text-brand-forest pt-2">
                  {quizQuestions[quizStep].q}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {quizQuestions[quizStep].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuizAnswer(opt.points)}
                      className="rounded-2xl border border-brand-leaf/20 bg-white/60 p-4 text-left text-xs sm:text-sm font-semibold text-brand-forest hover:bg-white/95 hover:border-brand-leaf hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-brand-leaf"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-white/70 p-6 border border-brand-leaf/30 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
                      Your Hygiene Index Score
                    </span>
                    <h4 className="text-3xl font-black text-brand-forest mt-0.5">
                      {quizScore} / 90 Points ({Math.round((quizScore / 90) * 100)}%)
                    </h4>
                  </div>
                  <Badge className="bg-brand-leaf text-white px-3 py-1 text-sm font-bold">
                    {quizScore >= 80
                      ? '🛡️ Excellent Immunity Guard'
                      : quizScore >= 50
                      ? '🌿 Solid Foundation with Room to Grow'
                      : '⚠️ Critical Hygiene Gaps Detected'}
                  </Badge>
                </div>
                <p className="text-sm text-brand-body leading-relaxed">
                  {quizScore >= 80
                    ? 'Outstanding! Your routines follow modern infection prevention guidelines closely. Keep up your phone wipe-down and handwashing rigor.'
                    : 'Good effort! By focusing on consistent 20-second hand scrubbing and weekly bedding sanitization, you can drastically reduce illness risks.'}
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <Button size="sm" onClick={resetQuiz} variant="secondary">
                    Retake Quiz
                  </Button>
                  <Link href="/tips">
                    <Button size="sm">
                      Read Recommended Tips <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Featured Hygiene Guides Carousel / Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-leaf">
                ✦ Essential Knowledge
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-brand-forest mt-1">
                Featured Health & Hygiene Tips
              </h3>
              <p className="text-sm text-brand-body mt-1">
                Hand-picked guidelines verified by sanitation and medical experts.
              </p>
            </div>
            <Link href="/tips">
              <Button variant="outline" className="flex items-center gap-1.5 self-start">
                View All Tips ({INITIAL_TIPS.length}) <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTips.map((tip) => (
              <Link
                key={tip.id}
                href={`/tips/${tip.id}`}
                className="group focus:outline-none focus:ring-2 focus:ring-brand-leaf rounded-3xl"
              >
                <Card className="h-full flex flex-col justify-between p-6 border border-white/60 bg-white/70 hover:bg-white/95 hover:border-brand-leaf/40 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
                        {tip.category}
                      </span>
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        <Sparkles className="h-2.5 w-2.5" /> Featured
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-brand-forest group-hover:text-brand-leaf transition-colors leading-snug mb-2">
                      {tip.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-brand-body line-clamp-3 leading-relaxed">
                      {tip.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-leaf/15 flex items-center justify-between text-xs text-brand-body/75">
                    <span>{tip.readTime || '3 min read'}</span>
                    <span className="font-semibold text-brand-leaf flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Read Guide <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Medical Vault & Informative Callout */}
        <div className="rounded-3xl border border-white/60 bg-gradient-to-r from-brand-forest to-brand-body p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-brand-leaf/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-pale">
              <HeartHandshake className="h-3.5 w-3.5 text-brand-mint" /> Community & Records
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Keep your health reports & hygiene records organized.
            </h3>
            <p className="text-sm sm:text-base text-brand-pale/90 leading-relaxed">
              Upload vaccination records, dental checkup summaries, or medical lab PDFs safely in
              your personal HealthHub storage.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link href="/upload">
                <Button size="lg" className="bg-white text-brand-forest hover:bg-white/90">
                  <UploadCloud className="mr-2 h-4 w-4 text-brand-leaf" /> Go to File Vault
                </Button>
              </Link>
              <Link href="/tips">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10"
                >
                  Browse Hygiene Library
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
