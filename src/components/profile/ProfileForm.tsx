import { useState } from 'react';
import { Save, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/store/useUserStore';

export function ProfileForm() {
  const profile = useUserStore((s) => s.profile);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(profile.nickname);
  const [bio, setBio] = useState(profile.bio);

  const handleSave = () => {
    updateProfile({ nickname: nickname.trim() || '开发者', bio: bio.trim() });
    setEditing(false);
  };

  const handleCancel = () => {
    setNickname(profile.nickname);
    setBio(profile.bio);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">个人信息</h3>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="mr-1 h-3.5 w-3.5" />
            编辑
          </Button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-muted">昵称</label>
            <p className="text-sm font-medium text-text-primary">{profile.nickname}</p>
          </div>
          <div>
            <label className="text-xs text-text-muted">个人简介</label>
            <p className="text-sm text-text-secondary">{profile.bio || '暂无简介，点击编辑添加'}</p>
          </div>
          <div>
            <label className="text-xs text-text-muted">注册时间</label>
            <p className="text-sm text-text-secondary">
              {new Date(profile.createdAt).toLocaleDateString('zh-CN')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">编辑信息</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="mr-1 h-3.5 w-3.5" />
            取消
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-1 h-3.5 w-3.5" />
            保存
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-text-muted">昵称</label>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="输入昵称"
            maxLength={20}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">个人简介</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="介绍一下自己..."
            rows={3}
            maxLength={200}
            className="w-full resize-none rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>
    </div>
  );
}
