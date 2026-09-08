import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import GlitchText from '@/components/GlitchText';

export function NotFoundPage() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      {/* Starfield background */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-text-muted"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              opacity: 0.3,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Floating astronaut (pure CSS) */}
      <motion.div
        className="relative mb-6"
        animate={{
          y: [0, -20, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Helmet */}
          <circle
            cx="60"
            cy="45"
            r="28"
            fill="var(--bg-tertiary)"
            stroke="var(--border-hover)"
            strokeWidth="3"
          />
          <circle cx="60" cy="45" r="22" fill="var(--bg-primary)" />
          {/* Visor reflection */}
          <ellipse cx="55" cy="40" rx="14" ry="12" fill="var(--accent)" opacity="0.15" />
          <ellipse cx="52" cy="37" rx="6" ry="4" fill="var(--accent)" opacity="0.25" />
          {/* Body */}
          <rect
            x="38"
            y="68"
            width="44"
            height="30"
            rx="12"
            fill="var(--bg-tertiary)"
            stroke="var(--border-hover)"
            strokeWidth="3"
          />
          {/* Backpack */}
          <rect
            x="28"
            y="72"
            width="12"
            height="22"
            rx="4"
            fill="var(--bg-tertiary)"
            stroke="var(--border-hover)"
            strokeWidth="2"
          />
          {/* Arms */}
          <motion.rect
            x="82"
            y="72"
            width="14"
            height="8"
            rx="4"
            fill="var(--bg-tertiary)"
            stroke="var(--border-hover)"
            strokeWidth="2"
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '82px 76px' }}
          />
          {/* Legs */}
          <rect
            x="44"
            y="96"
            width="10"
            height="16"
            rx="4"
            fill="var(--bg-tertiary)"
            stroke="var(--border-hover)"
            strokeWidth="2"
          />
          <rect
            x="66"
            y="96"
            width="10"
            height="16"
            rx="4"
            fill="var(--bg-tertiary)"
            stroke="var(--border-hover)"
            strokeWidth="2"
          />
          {/* Antenna */}
          <line x1="60" y1="17" x2="60" y2="8" stroke="var(--border-hover)" strokeWidth="2" />
          <motion.circle
            cx="60"
            cy="6"
            r="3"
            fill="var(--accent)"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>
      </motion.div>

      {/* 404 text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <GlitchText
          speed={0.8}
          enableShadows
          className="!text-[clamp(3rem,12vw,8rem)] !bg-transparent"
        >
          404
        </GlitchText>
      </motion.div>

      <motion.p
        className="mt-4 text-lg text-text-secondary"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        哎呀，这个页面飘到太空去了 🚀
      </motion.p>

      <motion.p
        className="mt-1 text-sm text-text-muted"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        你访问的页面不存在或已被移除
      </motion.p>

      <motion.div
        className="mt-8 flex gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link to={ROUTES.HOME}>
          <Button size="lg">返回首页</Button>
        </Link>
        <Link to={ROUTES.TOOLS}>
          <Button size="lg" variant="secondary">
            浏览工具
          </Button>
        </Link>
      </motion.div>

      {/* Tether line (decorative) */}
      <svg
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        width="2"
        height="200"
        viewBox="0 0 2 200"
      >
        <motion.line
          x1="1"
          y1="0"
          x2="1"
          y2="200"
          stroke="var(--border)"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.8 }}
        />
      </svg>
    </div>
  );
}
