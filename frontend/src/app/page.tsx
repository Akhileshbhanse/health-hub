import Link from 'next/link'
import Card from '@/components/Card'

export default function Home() {
  const features = [
    {
      title: 'Hygiene Tips',
      description: 'Access curated health and hygiene best practices',
      icon: '💡',
      link: '/tips',
    },
    {
      title: 'Personal Dashboard',
      description: 'Get personalized recommendations tailored to you',
      icon: '👤',
      link: '/dashboard',
    },
    {
      title: 'Upload Reports',
      description: 'Upload and manage your health reports securely',
      icon: '📤',
      link: '/upload',
    },
    {
      title: 'Track Progress',
      description: 'Monitor your health and hygiene improvements',
      icon: '📊',
      link: '/dashboard',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Your Health & Hygiene Partner
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Discover personalized recommendations, expert tips, and track your
              health journey all in one place.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
              <Link
                href="/tips"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Explore Tips
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={index} href={feature.link}>
                <Card className="h-full hover:shadow-lg transition cursor-pointer">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                500+
              </div>
              <p className="text-gray-600 dark:text-gray-400">Hygiene Tips</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-600 mb-2">
                10K+
              </div>
              <p className="text-gray-600 dark:text-gray-400">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                95%
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Satisfaction Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Your Health Journey Today
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of users improving their health and hygiene practices
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Sign Up Free
          </Link>
        </div>
      </section>
    </div>
  )
}
