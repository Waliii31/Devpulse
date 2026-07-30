import os

file_path = r'd:\Devpulse\frontend\src\components\sections\DashboardSection.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: toLowerCase optional chaining
content = content.replace('lang.toLowerCase()', 'lang?.toLowerCase()')
content = content.replace('repo.language.toLowerCase()', 'repo.language?.toLowerCase()')
content = content.replace('article.source.toLowerCase()', 'article.source?.toLowerCase()')
content = content.replace('article.source.length', '(article.source?.length || 0)')
content = content.replace('article.source.substring', 'article.source?.substring')

# Fix 2: Add Tutorial Modal and useState/useEffect
content = content.replace("import { useMemo } from 'react'", "import { useMemo, useEffect, useState } from 'react'")

tutorial_modal_jsx = """    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-50 mx-4 mt-4"
          >
            <div className="bg-gradient-to-r from-[var(--terminal-green)] to-[var(--cursor-amber)] p-1 rounded-xl shadow-2xl">
              <div className="bg-[var(--surface-container)] rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--terminal-green)] opacity-10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-[var(--cursor-amber)] opacity-10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex-1 z-10">
                  <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Welcome to DevPulse! 🎉</h3>
                  <p className="text-[var(--text-secondary)]">
                    You're currently viewing a demo profile. To track your own stats, 
                    <strong className="text-[var(--text-primary)] mx-1">search for your GitHub username</strong> 
                    in the top search bar!
                  </p>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="z-10 px-6 py-2 bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-highest)] text-[var(--text-primary)] rounded-lg transition-colors font-medium border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--terminal-green)] whitespace-nowrap"
                >
                  Got it!
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bento Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">"""

content = content.replace("""    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Bento Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">""", tutorial_modal_jsx)

# Fix 3: Add showTutorial state
hooks_insertion = """  const topRepos = profile?.repos.slice(0, 3) ?? []
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    if (window.location.search.includes('tutorial=true')) {
      setShowTutorial(true)
    }
  }, [])"""

content = content.replace("  const topRepos = profile?.repos.slice(0, 3) ?? []", hooks_insertion)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("DashboardSection.tsx fixed successfully!")
