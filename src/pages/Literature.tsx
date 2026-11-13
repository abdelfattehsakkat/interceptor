import { useMemo, useState } from 'react';
import { SOURCES, sourceLevel } from '../data/sources';
import type { Theme } from '../types';
import { LevelBadge, PageHead, useApp } from '../components/ui';

const THEMES: Theme[] = [
  'Éducateur fonctionnel',
  'Timing & maturation',
  'Appareils amovibles',
  'Appareils fixes',
  'Orthopédie maxillaire',
  'Aligneurs',
  'Camouflage',
  'Diagnostic & céphalométrie',
  'ATM',
  'Traumatisme',
  'Parodonte',
  'Imagerie',
  'Coopération',
  'Tunisie',
];

export function LiteraturePage() {
  const { openSource } = useApp();
  const [q, setQ] = useState('');
  const [theme, setTheme] = useState('');
  const [type, setType] = useState('');
  const types = useMemo(() => Array.from(new Set(SOURCES.map((s) => s.type))), []);
  const list = SOURCES.filter((s) => {
    const hay = `${s.authors} ${s.title} ${s.journal} ${s.year} ${s.pmid} ${s.establishes}`.toLowerCase();
    return (!q || hay.includes(q.toLowerCase())) && (!theme || s.themes.includes(theme as Theme)) && (!type || s.type === type);
  }).sort((a, b) => b.year - a.year);

  return (
    <>
      <PageHead title="Littérature">
        Registre des références du guide. Chacune a été retrouvée dans PubMed (identifiant, titre, revue, DOI). Les affirmations du guide pointent vers ces entrées ; ce qui n'est pas retrouvé est marqué « NON SOURCÉ ».
      </PageHead>
      <div className="toolbar">
        <input placeholder="Rechercher (auteur, titre, PMID, mot-clé…)" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="">Tous les thèmes</option>
          {THEMES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tous les types</option>
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <p className="small muted">{list.length} référence(s) affichée(s) sur {SOURCES.length}.</p>
      <div className="card" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr><th>Référence</th><th>Type</th><th>Niveau</th><th>Ce qu'elle établit</th></tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td style={{ width: '34%' }}>
                  <a href="#" onClick={(e) => { e.preventDefault(); openSource(s.id); }}>
                    <strong>{s.title}</strong>
                  </a>
                  <div className="small muted">{s.authors.split(',').slice(0, 3).join(',')}{s.authors.split(',').length > 3 ? ', et al.' : ''} — {s.journal} {s.ref}</div>
                  <div className="small">PMID <a href={`https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`} target="_blank" rel="noreferrer">{s.pmid}</a>{s.doi && <> · DOI {s.doi}</>}</div>
                </td>
                <td>{s.type}</td>
                <td><LevelBadge level={sourceLevel(s)} />{!s.abstractRead && <div className="small muted">résumé non relu</div>}</td>
                <td className="small">{s.establishes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
