import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HealthHub',
  description: 'A calm, simple home for your health account.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            <div className="ambient-blob blob-one" aria-hidden="true" />
            <div className="ambient-blob blob-two" aria-hidden="true" />
            <div className="ambient-blob blob-three" aria-hidden="true" />
            <Navbar />
            <main className="relative z-10 flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
