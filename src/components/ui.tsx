import { createContext, useContext, type ReactNode } from 'react';
import type { CaseInput, Claim, Level, Status } from '../types';
import { LEVEL_LABEL, STATUS_LABEL } from '../types';
import { SOURCE_BY_ID, sourceLabel } from '../data/sources';

export interface AppCtx {
  openSource: (id: string) => void;
  go: (page: string, arg?: string) => void;
  input: CaseInput;
  setInput: (i: CaseInput) => void;
}

export const Ctx = createContext<AppCtx>({ openSource: () => {}, go: () => {}, input: {}, setInput: () => {} });
export const useApp = () => useContext(Ctx);

export function LevelBadge({ level }: { level: Level }) {
  return (
    <span className={`badge-level lv-${level}`} title={LEVEL_LABEL[level]}>
      {level === 'NS' ? 'NON SOURCÉ' : `Niveau ${level}`}
    </span>
  );
}

export function StatusPill({ status }: { status: Status }) {
  return <span className={`status st-${status}`}>{STATUS_LABEL[status]}</span>;
}

export function SourceChips({ ids }: { ids: string[] }) {
  const { openSource } = useApp();
  return (
    <>
      {ids.map((id) => (
        <button key={id} className="chip" onClick={() => openSource(id)} title={SOURCE_BY_ID[id]?.title}>
          {sourceLabel(id)}
        </button>
      ))}
    </>
  );
}

export function ClaimList({ claims }: { claims: Claim[] }) {
  return (
    <div>
      {claims.map((c, i) => (
        <div className="claim" key={i}>
          <LevelBadge level={c.level} />
          <div className="txt">
            <div>{c.text}</div>
            {c.note && <div className="note">{c.note}</div>}
            {c.sources.length > 0 && (
              <div>
                <SourceChips ids={c.sources} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageHead({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="page-head">
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  );
}

export function EvidenceLegend() {
  return (
    <div className="legend">
      {(['A', 'B', 'C', 'NS'] as Level[]).map((l) => (
        <span key={l}>
          <LevelBadge level={l} /> <span className="small muted">{LEVEL_LABEL[l]}</span>
        </span>
      ))}
    </div>
  );
}
