import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LandingPage from './pages/LandingPage';

const ResultsPage = lazy(() => import('./pages/ResultsPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-[#1a1a1a]" />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
