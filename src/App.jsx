import { lazy, Suspense, useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage';

const ResultsPage = lazy(() => import('./pages/ResultsPage'));

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [formState, setFormState] = useState(null);

  useEffect(() => {
    const handlePop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  useEffect(() => {
    if (path === '/results' && !formState) {
      window.history.replaceState(null, '', '/');
      setPath('/');
    }
  }, [path, formState]);

  const navigate = (nextPath, nextState) => {
    if (nextState) {
      setFormState(nextState);
    }
    if (nextPath !== path) {
      window.history.pushState(null, '', nextPath);
      setPath(nextPath);
    }
  };

  const handleRestart = () => {
    setFormState(null);
    navigate('/');
  };

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1a1a1a]" />}>
      {path === '/results' ? (
        <ResultsPage data={formState} onRestart={handleRestart} />
      ) : (
        <LandingPage onSubmit={(data) => navigate('/results', data)} />
      )}
    </Suspense>
  );
}
