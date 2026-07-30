import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider, useLocation, Outlet, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import { Navbar } from './components/layout/Navbar'
import { PageShell } from './components/layout/PageShell'
import { DashboardNavbar } from './components/dashboard/DashboardNavbar'
import { Sidebar } from './components/dashboard/Sidebar'
import { AboutSection } from './components/sections/AboutSection'
import { AuthPage } from './components/sections/AuthPage'
import { OAuthCallback } from './components/sections/OAuthCallback'
import { DashboardSection } from './components/sections/DashboardSection'
import { ActivityTab } from './components/dashboard/ActivityTab'
import { RepositoriesTab } from './components/dashboard/RepositoriesTab'
import { FavoritesTab } from './components/dashboard/FavoritesTab'
import { HistoryTab } from './components/dashboard/HistoryTab'
import { CompareTab } from './components/dashboard/CompareTab'
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

/** Dashboard layout — fixed sidebar + dashboard navbar + scrollable main */
function DashboardLayout() {
  return (
    <PageShell>
      <DashboardNavbar />
      <Sidebar />
      <main
        className="min-h-screen"
        style={{ paddingTop: '64px', paddingLeft: '256px' }}
      >
        {/* Hide sidebar padding on mobile where sidebar is hidden */}
        <style>{`
          @media (max-width: 1023px) {
            main { padding-left: 0 !important; }
          }
        `}</style>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </PageShell>
  )
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
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
    path: '/auth/github/callback',
    element: <OAuthCallback />,
  },
  {
    path: '/dashboard/:username',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardSection /> },
      { path: 'activity', element: <ActivityTab /> },
      { path: 'repos', element: <RepositoriesTab /> },
      { path: 'favorites', element: <FavoritesTab /> },
      { path: 'history', element: <HistoryTab /> },
      { path: 'compare', element: <CompareTab /> },
    ],
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
  const [redirectTo, setRedirectTo] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user.email) {
          setRedirectTo(`/dashboard/octocat?tutorial=true`)
        }
      } catch (e) {
        // ignore
      }
    }
  }, [])

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />
  }

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
