import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { HomePage } from '@/pages/HomePage';
import { ToolboxPage } from '@/pages/ToolboxPage';
import { JsonFormatterPage } from '@/pages/tools/JsonFormatterPage';

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
          <Route path="/about" element={<About />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
