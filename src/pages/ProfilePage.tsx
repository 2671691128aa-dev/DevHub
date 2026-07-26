import { motion } from 'framer-motion';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AvatarUploader } from '@/components/profile/AvatarUploader';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { UsageStats } from '@/components/profile/UsageStats';
import { FavoriteManager } from '@/components/profile/FavoriteManager';
import { HistoryManager } from '@/components/profile/HistoryManager';
import { useUserStore } from '@/store/useUserStore';
import { RotateCcw } from 'lucide-react';

export function ProfilePage() {
  const resetProfile = useUserStore((s) => s.resetProfile);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: '首页', path: '/' }, { label: '用户中心' }]} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 mt-4"
      >
        <h1 className="text-2xl font-semibold text-text-primary">用户中心</h1>
        <p className="mt-1 text-sm text-text-muted">管理个人信息和使用数据</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Profile */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="space-y-4"
        >
          <Card className="!p-6">
            <div className="flex flex-col items-center gap-4">
              <AvatarUploader />
              <ProfileForm />
            </div>
          </Card>
          <Card className="!p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-text-primary">重置数据</h3>
                <p className="text-xs text-text-muted">恢复默认个人资料</p>
              </div>
              <Button variant="secondary" size="sm" onClick={resetProfile}>
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                重置
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Right Column: Stats & History */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-4 lg:col-span-2"
        >
          <UsageStats />
          <FavoriteManager />
          <HistoryManager />
        </motion.div>
      </div>
    </div>
  );
}
