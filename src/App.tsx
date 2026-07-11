import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';

function Home() {
  return <div className="p-6">首页占位</div>;
}

function Toolbox() {
  return <div className="p-6">工具中心占位</div>;
}

function About() {
  return <div className="p-6">关于占位</div>;
}

function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Toolbox />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
