import { useState, useRef, type ChangeEvent } from 'react';
import { Camera } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

const EMOJI_AVATARS = [
  '👨‍💻',
  '👩‍💻',
  '🧑‍💻',
  '🦊',
  '🐱',
  '🐶',
  '🦁',
  '🐼',
  '🐨',
  '🦄',
  '🐲',
  '🎃',
  '🤖',
  '👾',
  '🎯',
  '⚡',
];

export function AvatarUploader() {
  const avatar = useUserStore((s) => s.profile.avatar);
  const avatarType = useUserStore((s) => s.profile.avatarType);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const [showPicker, setShowPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Compress to 128x128
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 128, 128);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        updateProfile({ avatar: dataUrl, avatarType: 'url' });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar display */}
      <div className="group relative">
        <div className="bg-accent/10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl text-4xl">
          {avatarType === 'url' ? (
            <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            avatar
          )}
        </div>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white shadow-md transition-transform hover:scale-110"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Avatar picker dropdown */}
      {showPicker && (
        <div className="rounded-xl border border-border bg-bg-secondary p-3 shadow-xl">
          <p className="mb-2 text-xs font-medium text-text-muted">选择表情头像</p>
          <div className="grid grid-cols-8 gap-1">
            {EMOJI_AVATARS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  updateProfile({ avatar: emoji, avatarType: 'emoji' });
                  setShowPicker(false);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors hover:bg-bg-tertiary"
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="mt-2 border-t border-border pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg bg-bg-tertiary px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-border"
            >
              上传自定义图片
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
