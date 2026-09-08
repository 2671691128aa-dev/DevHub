import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Github, Terminal, Menu, X, Sun, Moon, LogIn } from 'lucide-react';
import { SignInButton, UserButton } from '@clerk/react';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/store/useAppStore';
import { useUserStore } from '@/store/useUserStore';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, EXTERNAL_LINKS } from '@/constants';

const navLinks = [
  { label: '首页', path: ROUTES.HOME },
  { label: '工具', path: ROUTES.TOOLS },
  { label: '关于', path: ROUTES.ABOUT },
];

export function Navbar() {
  const location = useLocation();
  const openCommandPalette = useAppStore((s) => s.openCommandPalette);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const avatar = useUserStore((s) => s.profile.avatar);
  const avatarType = useUserStore((s) => s.profile.avatarType);
  const { isLoaded, isSignedIn } = useAuth();
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
        <div className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                location.pathname === link.path
                  ? 'bg-bg-tertiary text-text-primary'
                  : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary',
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
            <kbd className="hidden h-5 items-center rounded border border-border bg-bg-tertiary px-1.5 text-[10px] font-medium text-text-muted sm:inline-flex">
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
          {isLoaded && isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-7 w-7 rounded-md',
                },
              }}
            />
          ) : isLoaded && !isSignedIn ? (
            <SignInButton mode="modal">
              <button
                className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                title="登录"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">登录</span>
              </button>
            </SignInButton>
          ) : (
            <Link
              to={ROUTES.PROFILE}
              className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              title="用户中心"
            >
              {avatarType === 'url' ? (
                <img src={avatar} alt="avatar" className="h-full w-full rounded-md object-cover" />
              ) : (
                <span className="text-sm">{avatar}</span>
              )}
            </Link>
          )}
          <a
            href={EXTERNAL_LINKS.GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary sm:flex"
          >
            <Github className="h-4 w-4" />
          </a>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary sm:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="space-y-1 border-t border-border bg-bg-primary px-6 py-3 sm:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                location.pathname === link.path
                  ? 'bg-bg-tertiary text-text-primary'
                  : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary',
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
