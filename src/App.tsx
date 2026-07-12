import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { HomePage } from '@/pages/HomePage';
import { ToolboxPage } from '@/pages/ToolboxPage';
import { JsonFormatterPage } from '@/pages/tools/JsonFormatterPage';
import { RegexTesterPage } from '@/pages/tools/RegexTesterPage';
import { AiChatPage } from '@/pages/tools/AiChatPage';
import { MarkdownEditorPage } from '@/pages/tools/MarkdownEditorPage';
import { AboutPage } from '@/pages/AboutPage';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { ROUTES } from '@/constants/routes';

function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.TOOLS} element={<ToolboxPage />} />
          <Route path={ROUTES.TOOLS_JSON} element={<JsonFormatterPage />} />
          <Route path={ROUTES.TOOLS_REGEX} element={<RegexTesterPage />} />
          <Route path={ROUTES.TOOLS_AI_CHAT} element={<AiChatPage />} />
          <Route path={ROUTES.TOOLS_MARKDOWN} element={<MarkdownEditorPage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        </Routes>
        <CommandPalette />
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
