import { useEffect, useState } from 'react';
import { APPLIANCES, type ApplianceId } from '../data/appliances';
import { ClaimList, PageHead, useApp } from '../components/ui';

export function AppliancesPage({ arg }: { arg?: string }) {
  const { go } = useApp();
  const [sel, setSel] = useState<ApplianceId>((arg as ApplianceId) || 'activator');
  useEffect(() => {
    if (arg && APPLIANCES.some((a) => a.id === arg)) setSel(arg as ApplianceId);
  }, [arg]);
  const a = APPLIANCES.find((x) => x.id === sel)!;

  return (
    <>
      <PageHead title="Appareils">Une fiche par appareil : principe, cas où il est logique, cas où il est déconseillé, ce qu'il ne fait pas, effets rapportés, coopération et effets indésirables.</PageHead>
      <div className="split">
        <div className="listnav">
          {APPLIANCES.map((x) => (
            <button key={x.id} className={x.id === sel ? 'active' : ''} onClick={() => setSel(x.id)}>
              {x.name}
              <small>{x.family}</small>
            </button>
          ))}
        </div>
        <div>
          <div className="card">
            <h2>{a.name}</h2>
            <p>{a.summary}</p>
            <div className="legend">
              <span className="tag">{a.family}</span>
              <span className="tag">Preuve : {a.evidenceGrade}</span>
            </div>
            {a.focus && (
              <p style={{ marginTop: 10 }}>
                <button className="btn small" onClick={() => go('educateur')}>
                  Ouvrir la page dédiée à l'éducateur fonctionnel
                </button>
              </p>
            )}
            <p className="small muted">{a.evidenceText} <em>(Synthèse du guide, brouillon à valider.)</em></p>
          </div>
          <div className="card"><h3>Principe</h3><ClaimList claims={a.principle} /></div>
          <div className="card"><h3>Dans quel cas il est le plus logique</h3><ClaimList claims={a.mostLogical} /></div>
          <div className="card"><h3>Dans quel cas il est déconseillé</h3><ClaimList claims={a.discouraged} /></div>
          <div className="card"><h3>Ce qu'il ne fait pas</h3><ClaimList claims={a.doesNot} /></div>
          <div className="card"><h3>Effets rapportés</h3><ClaimList claims={a.effects} /></div>
          <div className="grid cols-3">
            <div className="card"><h3>Durée</h3><ClaimList claims={a.duration} /></div>
            <div className="card"><h3>Coopération</h3><ClaimList claims={a.cooperation} /></div>
            <div className="card"><h3>Effets indésirables</h3><ClaimList claims={a.adverse} /></div>
          </div>
          <div className="card">
            <h3>Ce dont le guide n'est pas sûr</h3>
            <ul>{a.uncertainties.map((u) => <li key={u}>{u}</li>)}</ul>
          </div>
        </div>
      </div>
    </>
  );
}
