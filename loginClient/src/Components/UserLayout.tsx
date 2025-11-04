import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { FiLogOut, FiUser, FiHome, FiSettings, FiMenu, FiX, FiMoon, FiSun } from "react-icons/fi"
import { apiService } from "../services/ApiService"
import type { ApiConfig } from "../services/ApiService"
import { useTheme } from "../hooks/useTheme"

type NavItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { path: "dashboard", label: "Dashboard", icon: FiHome },
  { path: "profile", label: "Profile", icon: FiUser },
  { path: "settings", label: "Settings", icon: FiSettings },
];

const UserLayout = () => {
  const { isDark, toggleTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const api: ApiConfig = {
    url: "/users/user",
    method: "GET",
  }

  // Check authentication & fetch user profile
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/auth/login')
      return
    }

    let isMounted = true

    apiService(api)
      .then((res) => {
        if (isMounted && res?.data) {
          setUser(res.data)
        }
      })
      .catch((error) => {
        console.error('Failed to fetch user profile', error)
      })

    return () => {
      isMounted = false
    }
  }, [navigate])

  // Keep theme in sync when layout mounts
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (storedTheme === 'light') {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Close sidebar when route changes (mobile UX)
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  const activeSegment = location.pathname.startsWith('/user/')
    ? location.pathname.replace('/user/', '')
    : 'dashboard'

  const activeNav = useMemo(() => navItems.find((item) => activeSegment.startsWith(item.path))?.label ?? 'Dashboard', [activeSegment])

  const handleNavigate = (path: string) => {
    navigate(`/user/${path}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/auth/login')
  }

  return (
    <div className={`relative flex min-h-screen bg-canvas bg-aurora text-primary transition-colors duration-300`}>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className="md:hidden fixed top-4 left-4 z-50 rounded-full bg-primary text-white p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        aria-label="Toggle navigation"
      >
        {isSidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 w-72 bg-glass shadow-soft md:shadow-none border-r border-strong transition-transform duration-300 ease-in-out z-50 flex flex-col backdrop-blur`}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-strong">
          <div>
            <h1 className="text-lg font-semibold">Login Portal</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full bg-layer text-secondary shadow-soft/40 hover:text-primary transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = activeSegment.startsWith(path)
            return (
              <button
                key={path}
                onClick={() => {
                  handleNavigate(path)
                  setIsSidebarOpen(false)
                }}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/15 text-primary shadow-inner'
                    : 'text-secondary hover:bg-layer hover:text-primary'
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full transition-all ${
                    isActive ? 'bg-primary' : 'bg-transparent group-hover:bg-primary/40'
                  }`}
                />
                <Icon className={`text-lg ${isActive ? 'text-primary' : 'text-secondary group-hover:text-primary'}`} />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-strong px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white text-lg font-semibold shadow-soft/60">
              {(user?.name ?? user?.email ?? 'U')?.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">{user?.name ?? 'Welcome back'}</p>
              <p className="text-xs text-secondary truncate">{user?.email ?? 'user@example.com'}</p>
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={toggleTheme}
                  className="md:hidden inline-flex items-center gap-2 text-xs font-medium text-secondary hover:text-primary"
                >
                  {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
                  {isDark ? 'Light mode' : 'Dark mode'}
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-lg bg-layer px-3 py-2 text-xs font-medium text-secondary shadow-soft/30 hover:text-primary transition-colors"
                >
                  <FiLogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col bg-layer">
        <header className="sticky top-0 z-30 border-b border-strong bg-glass">
          <div className="flex items-center justify-between px-4 py-5 md:px-8">
            <div>
              <h2 className="text-xl font-semibold text-primary">{activeNav}</h2>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-secondary">
              <div className="text-right">
                <p className="font-medium text-primary">{user?.name ?? 'User'}</p>
                <p className="text-xs text-secondary">{user?.email ?? 'user@example.com'}</p>
              </div>
              <div className="h-10 w-px bg-border" aria-hidden />
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-full bg-layer px-4 py-2 text-xs font-semibold text-secondary shadow-soft/40 hover:text-primary transition-colors"
              >
                {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
                <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default UserLayout