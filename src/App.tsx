import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { ROUTES } from '@/constants/routes';

// Route-level code splitting: each tool page loads on demand
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const ToolboxPage = lazy(() => import('@/pages/ToolboxPage').then(m => ({ default: m.ToolboxPage })));
const JsonFormatterPage = lazy(() => import('@/pages/tools/JsonFormatterPage').then(m => ({ default: m.JsonFormatterPage })));
const RegexTesterPage = lazy(() => import('@/pages/tools/RegexTesterPage').then(m => ({ default: m.RegexTesterPage })));
const AiChatPage = lazy(() => import('@/pages/tools/AiChatPage').then(m => ({ default: m.AiChatPage })));
const MarkdownEditorPage = lazy(() => import('@/pages/tools/MarkdownEditorPage').then(m => ({ default: m.MarkdownEditorPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));

function LoadingFallback() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.TOOLS} element={<ToolboxPage />} />
            <Route path={ROUTES.TOOLS_JSON} element={<JsonFormatterPage />} />
            <Route path={ROUTES.TOOLS_REGEX} element={<RegexTesterPage />} />
            <Route path={ROUTES.TOOLS_AI_CHAT} element={<AiChatPage />} />
            <Route path={ROUTES.TOOLS_MARKDOWN} element={<MarkdownEditorPage />} />
            <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          </Routes>
        </Suspense>
        <CommandPalette />
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
