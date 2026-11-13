import { SOURCE_BY_ID, SOURCES, sourceLevel } from '../data/sources';
import { APPLIANCES } from '../data/appliances';
import { LevelBadge } from './ui';

export function SourceDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  if (!id) return null;
  const s = SOURCE_BY_ID[id];
  if (!s) return null;
  const usedBy = APPLIANCES.filter((a) =>
    [...a.principle, ...a.mostLogical, ...a.discouraged, ...a.doesNot, ...a.effects, ...a.duration, ...a.cooperation, ...a.adverse].some((c) => c.sources.includes(id)),
  );
  return (
    <>
      <div className="drawer-back" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Détail de la source">
        <button className="btn ghost small" onClick={onClose}>
          Fermer
        </button>
        <h3>{s.title}</h3>
        <p className="muted small">{s.authors}</p>
        <dl className="kv">
          <dt>Revue</dt>
          <dd>
            {s.journal} {s.ref}
          </dd>
          <dt>Type d'étude</dt>
          <dd>{s.type}</dd>
          <dt>Niveau</dt>
          <dd>
            <LevelBadge level={sourceLevel(s)} /> <span className="small muted">{sourceLevel(s) === 'A' ? "preuve issue d'études" : 'consensus / enseignement classique'}</span>
          </dd>
          <dt>PMID</dt>
          <dd>
            <a href={`https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`} target="_blank" rel="noreferrer">
              {s.pmid}
            </a>
          </dd>
          {s.doi && (
            <>
              <dt>DOI</dt>
              <dd>
                <a href={`https://doi.org/${s.doi}`} target="_blank" rel="noreferrer">
                  {s.doi}
                </a>
              </dd>
            </>
          )}
          <dt>Thèmes</dt>
          <dd>{s.themes.join(', ')}</dd>
          <dt>Résumé lu</dt>
          <dd>{s.abstractRead ? 'Oui' : 'Non (partiel ou titre seulement)'}</dd>
        </dl>
        <h3>Ce que la source établit</h3>
        <p>{s.establishes}</p>
        {usedBy.length > 0 && (
          <>
            <h3>Utilisée dans les fiches</h3>
            <p className="small">{usedBy.map((a) => a.name).join(' · ')}</p>
          </>
        )}
        <p className="small muted">{SOURCES.length} références dans le registre, toutes retrouvées dans PubMed.</p>
      </aside>
    </>
  );
}
