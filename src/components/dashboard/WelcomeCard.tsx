import { motion } from 'framer-motion';
import { useUserStore } from '@/store/useUserStore';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了';
  if (hour < 12) return '早上好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  if (hour < 22) return '晚上好';
  return '夜深了';
}

export function WelcomeCard() {
  const nickname = useUserStore((s) => s.profile.nickname);
  const avatar = useUserStore((s) => s.profile.avatar);
  const avatarType = useUserStore((s) => s.profile.avatarType);

  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="from-accent/8 to-accent/3 relative overflow-hidden rounded-xl border border-border bg-gradient-to-br via-bg-secondary p-4 sm:min-w-[240px]"
    >
      {/* Animated gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-accent/10 absolute -right-12 -top-12 h-48 w-48 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -25, 20, 0],
            y: [0, 15, -25, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-purple-500/8 absolute -bottom-8 -left-8 h-40 w-40 rounded-full blur-3xl"
        />
      </div>

      <div className="relative flex items-center gap-3">
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 3 }}
          className="bg-accent/10 ring-accent/20 flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg text-lg ring-2"
        >
          {avatarType === 'url' ? (
            <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            avatar
          )}
        </motion.div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-text-primary">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {`${getGreeting()}，${nickname}`}
            </motion.span>
          </h2>
          <p className="mt-0.5 text-xs text-text-muted">{dateStr}</p>
        </div>
      </div>
    </motion.div>
  );
}
