import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { PageLayout } from '@/components/layout/PageLayout';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { ErrorFallback } from '@/components/shared/ErrorFallback';
import { PageSkeleton } from '@/components/shared/PageSkeleton';
import { ToastProvider } from '@/components/shared/ToastProvider';
import { reportError } from '@/lib/reportError';
import { ROUTES } from '@/constants/routes';
import { useTrackRouteChange } from '@/hooks/useTrackRouteChange';

// Route-level code splitting: each tool page loads on demand
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const ToolboxPage = lazy(() =>
  import('@/pages/ToolboxPage').then((m) => ({ default: m.ToolboxPage })),
);
const JsonFormatterPage = lazy(() =>
  import('@/pages/tools/JsonFormatterPage').then((m) => ({ default: m.JsonFormatterPage })),
);
const RegexTesterPage = lazy(() =>
  import('@/pages/tools/RegexTesterPage').then((m) => ({ default: m.RegexTesterPage })),
);
const AiChatPage = lazy(() =>
  import('@/pages/tools/AiChatPage').then((m) => ({ default: m.AiChatPage })),
);
const MarkdownEditorPage = lazy(() =>
  import('@/pages/tools/MarkdownEditorPage').then((m) => ({ default: m.MarkdownEditorPage })),
);
const Base64Page = lazy(() =>
  import('@/pages/tools/Base64Page').then((m) => ({ default: m.Base64Page })),
);
const CodeReviewPage = lazy(() =>
  import('@/pages/tools/CodeReviewPage').then((m) => ({ default: m.CodeReviewPage })),
);
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function AppContent() {
  useTrackRouteChange();
  return (
    <>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.TOOLS} element={<ToolboxPage />} />
          <Route path={ROUTES.TOOLS_JSON} element={<JsonFormatterPage />} />
          <Route path={ROUTES.TOOLS_REGEX} element={<RegexTesterPage />} />
          <Route path={ROUTES.TOOLS_AI_CHAT} element={<AiChatPage />} />
          <Route path={ROUTES.TOOLS_MARKDOWN} element={<MarkdownEditorPage />} />
          <Route path={ROUTES.TOOLS_BASE64} element={<Base64Page />} />
          <Route path={ROUTES.TOOLS_CODE_REVIEW} element={<CodeReviewPage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <CommandPalette />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => <ErrorFallback {...props} variant="page" />}
      onError={(error, info) => reportError(error, info.componentStack ?? undefined)}
    >
      <BrowserRouter>
        <PageLayout>
          <ErrorBoundary
            FallbackComponent={(props) => <ErrorFallback {...props} variant="section" />}
            onError={(error, info) => reportError(error, info.componentStack ?? undefined)}
          >
            <AppContent />
          </ErrorBoundary>
        </PageLayout>
      </BrowserRouter>
      <ToastProvider />
    </ErrorBoundary>
  );
}

export default App;
