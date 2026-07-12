import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Github, Terminal, Menu, X, Sun, Moon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/store/useAppStore';

const navLinks = [
  { label: '首页', path: '/' },
  { label: '工具', path: '/tools' },
  { label: '关于', path: '/about' },
];

export function Navbar() {
  const location = useLocation();
  const openCommandPalette = useAppStore((s) => s.openCommandPalette);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      // 下滑超过 10px 且向下滑动 → 隐藏
      if (currentY > lastScrollY.current && currentY > 56) {
        setHidden(true);
      }
      // 上滑超过 10px → 显示
      if (lastScrollY.current - currentY > 10) {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 路由切换时始终显示
  useEffect(() => {
    setHidden(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-border backdrop-blur-xl transition-transform duration-300',
        hidden && 'translate-y-[-100%]',
      )}
      style={{ backgroundColor: 'var(--bg-primary-90)' }}
    >
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-text-primary">
          <Terminal className="h-5 w-5 text-accent" />
          <span>DevHub</span>
        </Link>

        {/* Nav Links - desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                location.pathname === link.path
                  ? 'text-text-primary bg-bg-tertiary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={openCommandPalette}
            className="flex h-8 items-center gap-2 rounded-md border border-border bg-bg-secondary px-3 text-sm text-text-muted transition-colors hover:border-border-hover hover:text-text-secondary"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">搜索</span>
            <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-bg-tertiary px-1.5 text-[10px] font-medium text-text-muted">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
            title={theme === 'dark' ? '切换到亮色模式' : '切换到深色模式'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            <Github className="h-4 w-4" />
          </a>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-bg-primary px-6 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                location.pathname === link.path
                  ? 'text-text-primary bg-bg-tertiary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
