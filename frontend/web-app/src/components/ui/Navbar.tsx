import { Link, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon, ChartIcon, UserIcon } from './icons';

interface NavbarProps {
  theme: string;
  toggleTheme: () => void;
}

interface NavLink {
  path: string;
  label: string;
  icon: React.ReactNode;
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const location = useLocation();

  const navLinks: NavLink[] = [
    { path: '/',          label: 'Inicio',    icon: <UserIcon /> },
    { path: '/dashboard', label: 'Dashboard', icon: <ChartIcon /> },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200
                    dark:border-gray-800 transition-colors duration-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ─── Logo ──────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">CI</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">
              Churn<span className="text-blue-600">Insight</span>
            </span>
          </Link>

          {/* ─── Links + Toggle ────────────────────────────── */}
          <div className="flex items-center gap-1 sm:gap-4">

            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg
                            text-sm font-medium transition-colors duration-200
                            ${isActive(link.path)
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }`}
              >
                {link.icon}
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800
                         text-gray-600 dark:text-gray-400
                         hover:bg-gray-200 dark:hover:bg-gray-700
                         transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}