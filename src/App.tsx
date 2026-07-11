import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { HomePage } from '@/pages/HomePage';
import { ToolboxPage } from '@/pages/ToolboxPage';
import { JsonFormatterPage } from '@/pages/tools/JsonFormatterPage';
import { RegexTesterPage } from '@/pages/tools/RegexTesterPage';
import { AiChatPage } from '@/pages/tools/AiChatPage';
import { MarkdownEditorPage } from '@/pages/tools/MarkdownEditorPage';

function About() {
  return <div className="p-6">关于占位</div>;
}

function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolboxPage />} />
          <Route path="/tools/json" element={<JsonFormatterPage />} />
          <Route path="/tools/regex" element={<RegexTesterPage />} />
          <Route path="/tools/ai-chat" element={<AiChatPage />} />
          <Route path="/tools/markdown" element={<MarkdownEditorPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
