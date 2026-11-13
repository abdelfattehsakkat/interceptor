import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CaseInput } from './types';
import { Ctx, type AppCtx } from './components/ui';
import { SourceDrawer } from './components/SourceDrawer';
import { HomePage } from './pages/Home';
import { AnalysePage } from './pages/Analyse';
import { TrainerPage } from './pages/Trainer';
import { AppliancesPage } from './pages/Appliances';
import { LiteraturePage } from './pages/Literature';
import { AboutPage, CasesPage, DocsPage, ValidationPage } from './pages/Misc';

const NAV: Array<{ id: string; label: string; section?: string; badge?: string }> = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'analyse', label: 'Analyser un cas', section: 'Outil' },
  { id: 'educateur', label: 'Éducateur fonctionnel', badge: 'priorité' },
  { id: 'appareils', label: 'Appareils' },
  { id: 'cas', label: 'Cas de référence' },
  { id: 'litterature', label: 'Littérature', section: 'Connaissance' },
  { id: 'documentation', label: 'Documentation' },
  { id: 'validation', label: 'À valider' },
  { id: 'limites', label: 'Limites et cadre' },
];

function parseHash(): { page: string; arg?: string } {
  const h = decodeURIComponent(window.location.hash).replace(/^#\/?/, '');
  const [page, arg] = h.split('/');
  return { page: page || 'accueil', arg };
}

export default function App() {
  const [route, setRoute] = useState(parseHash());
  const [source, setSource] = useState<string | null>(null);
  const [input, setInput] = useState<CaseInput>({});
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const on = () => {
      setRoute(parseHash());
      setMenuOpen(false);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const go = useCallback((page: string, arg?: string) => {
    window.location.hash = arg ? `/${page}/${arg}` : `/${page}`;
    window.scrollTo({ top: 0 });
  }, []);

  const ctx = useMemo<AppCtx>(() => ({ openSource: setSource, go, input, setInput }), [go, input]);

  let page;
  switch (route.page) {
    case 'analyse': page = <AnalysePage />; break;
    case 'educateur': page = <TrainerPage />; break;
    case 'appareils': page = <AppliancesPage arg={route.arg} />; break;
    case 'litterature': page = <LiteraturePage />; break;
    case 'documentation': page = <DocsPage />; break;
    case 'cas': page = <CasesPage />; break;
    case 'validation': page = <ValidationPage />; break;
    case 'limites': page = <AboutPage />; break;
    default: page = <HomePage />;
  }

  return (
    <Ctx.Provider value={ctx}>
      <div className="app">
        <div className="mobile-bar no-print">
          <button className="burger" aria-label="Ouvrir le menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            <span />
            <span />
            <span />
          </button>
          <div className="brand-mark">II</div>
          <strong>Guide Classe II</strong>
        </div>
        {menuOpen && <div className="menu-back no-print" onClick={() => setMenuOpen(false)} />}
        <aside className={`sidebar${menuOpen ? ' open' : ''}`}>
          <div className="brand">
            <div className="brand-mark">II</div>
            <div>
              <h1>Guide Classe II</h1>
              <small>Aide à la réflexion clinique</small>
            </div>
          </div>
          <div className="draft-flag">Brouillon non validé par un clinicien. Le praticien décide.</div>
          <nav className="nav">
            {NAV.map((n) => (
              <div key={n.id}>
                {n.section && <div className="section">{n.section}</div>}
                <button className={route.page === n.id || (n.id === 'accueil' && !NAV.some((x) => x.id === route.page)) ? 'active' : ''} onClick={() => go(n.id)}>
                  <span>{n.label}</span>
                  {n.badge && <span className="badge">{n.badge}</span>}
                </button>
              </div>
            ))}
          </nav>
        </aside>
        <main className="main">
          <div className="topbar-notice no-print">Aide à la réflexion : ce n'est pas une recommandation de traitement. Chaque sortie est à confronter au jugement du praticien.</div>
          {page}
        </main>
      </div>
      <SourceDrawer id={source} onClose={() => setSource(null)} />
    </Ctx.Provider>
  );
}
