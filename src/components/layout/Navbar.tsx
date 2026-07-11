import { Link, useLocation } from 'react-router-dom';
import { Search, Github, Terminal } from 'lucide-react';
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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-text-primary">
          <Terminal className="h-5 w-5 text-accent" />
          <span>DevHub</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
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
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </nav>
    </header>
  );
}
