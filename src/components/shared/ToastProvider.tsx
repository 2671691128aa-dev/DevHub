import { Toaster } from 'sonner';

/** Toast 容器组件，配置项目级默认样式 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      theme="dark"
      toastOptions={{
        style: {
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
        },
      }}
    />
  );
}
