import Card from './Card'

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-190px)] max-w-lg items-center px-6 py-12">
      <Card className="w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-forest">{title}</h1>
          <p className="mt-2 text-brand-body">{description}</p>
        </div>
        {children}
      </Card>
    </section>
  )
}

export function Feedback({
  children,
  tone,
}: {
  children: React.ReactNode
  tone: 'error' | 'success'
}) {
  return (
    <div
      role="status"
      className={`rounded-xl border px-4 py-3 text-sm ${
        tone === 'error'
          ? 'border-red-300 bg-red-50/70 text-red-800'
          : 'border-brand-mint bg-brand-pale/70 text-brand-forest'
      }`}
    >
      {children}
    </div>
  )
}
