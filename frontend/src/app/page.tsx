import Link from 'next/link'
import Card from '@/components/Card'

export default function Home() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-190px)] max-w-6xl items-center px-6 py-16">
      <Card className="w-full px-6 py-12 text-center sm:px-16 sm:py-20">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-brand-leaf">Welcome to HealthHub</p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-brand-forest sm:text-6xl">
          A calmer way to care for your health.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-brand-body">
          Keep your HealthHub account close at hand and make space for informed, everyday health decisions.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/auth/login" className="primary-button">Log in</Link>
          <Link href="/auth/signup" className="secondary-button">Create an account</Link>
        </div>
      </Card>
    </section>
  )
}
