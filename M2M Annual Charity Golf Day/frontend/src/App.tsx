import { useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import { HelpPage } from './components/HelpPage';
import { InfoPage } from './components/InfoPage';
import { LandingPage } from './components/LandingPage';

export type AppPage = 'home' | 'help' | 'info';

function pageFromHash(): AppPage {
  if (window.location.hash === '#help') return 'help';
  if (window.location.hash === '#info') return 'info';
  return 'home';
}

export function App() {
  const [page, setPage] = useState<AppPage>(pageFromHash);

  useEffect(() => {
    const handleHashChange = () => setPage(pageFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function navigate(pageName: AppPage) {
    setPage(pageName);
    const nextHash = pageName === 'help' ? '#help' : pageName === 'info' ? '#info' : '#event';
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }
  }

  return (
    <AppShell currentPage={page} onNavigate={navigate}>
      {page === 'help' ? (
        <HelpPage onBack={() => navigate('home')} />
      ) : page === 'info' ? (
        <InfoPage onBack={() => navigate('home')} />
      ) : (
        <LandingPage onOpenHelp={() => navigate('help')} onOpenInfo={() => navigate('info')} />
      )}
    </AppShell>
  );
}
