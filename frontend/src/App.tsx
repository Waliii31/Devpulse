import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/layout/Navbar'
import { PageShell } from './components/layout/PageShell'
import { Sidebar } from './components/dashboard/Sidebar'
import { AboutSection } from './components/sections/AboutSection'
import { AuthPage } from './components/sections/AuthPage'
import { DashboardSection } from './components/sections/DashboardSection'
import { FaqSection } from './components/sections/FaqSection'
import { FeatureSection } from './components/sections/FeatureSection'
import { FooterSection } from './components/sections/FooterSection'
import { HeroSection } from './components/sections/HeroSection'
import { NotFoundPage } from './components/sections/NotFoundPage'
import { PricingSection } from './components/sections/PricingSection'
import { store } from './store'

const queryClient = new QueryClient()

function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.24 }}
    >
      {children}
    </motion.div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PageTransition>
        <LandingPage />
      </PageTransition>
    ),
  },
  {
    path: '/login',
    element: (
      <PageTransition>
        <AuthPage mode="login" />
      </PageTransition>
    ),
  },
  {
    path: '/signup',
    element: (
      <PageTransition>
        <AuthPage mode="signup" />
      </PageTransition>
    ),
  },
  {
    path: '/dashboard/:username',
    element: (
      <PageTransition>
        <DashboardPage />
      </PageTransition>
    ),
  },
  {
    path: '*',
    element: (
      <PageTransition>
        <NotFoundPage />
      </PageTransition>
    ),
  },
])

function LandingPage() {
  return (
    <PageShell>
      <Navbar />
      <main>
        <HeroSection />
        <FeatureSection />
        <AboutSection />
        <PricingSection />
        <FaqSection />
      </main>
      <FooterSection />
    </PageShell>
  )
}

function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <PageShell>
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:px-6">
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((value) => !value)} />
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full lg:flex-1"
        >
          <DashboardSection />
        </motion.div>
      </div>
    </PageShell>
  )
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  )
}

export default App
