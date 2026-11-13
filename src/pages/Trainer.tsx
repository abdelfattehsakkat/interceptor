import { useMemo } from 'react';
import { analyze } from '../engine/engine';
import { APPLIANCE_BY_ID } from '../data/appliances';
import { ClaimList, EvidenceLegend, PageHead, SourceChips, StatusPill, useApp } from '../components/ui';

function Bars({ title, rows, unit }: { title: string; rows: Array<{ label: string; v: number; cls: 't' | 'a' }>; unit: string }) {
  const max = Math.max(...rows.map((r) => Math.abs(r.v)));
  return (
    <div style={{ marginBottom: 14 }}>
      <strong className="small">{title}</strong>
      {rows.map((r) => (
        <div className="bar-row" key={r.label}>
          <span>{r.label}</span>
          <div className="bar-track">
            <div className={`bar ${r.cls}`} style={{ width: `${(Math.abs(r.v) / max) * 100}%` }} />
          </div>
          <span>
            {r.v} {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TrainerPage() {
  const { input, go } = useApp();
  const a = APPLIANCE_BY_ID.trainer;
  const res = useMemo(() => analyze(input), [input]);
  const v = res.verdicts.find((x) => x.applianceId === 'trainer');

  return (
    <>
      <PageHead title="Éducateur fonctionnel">
        Appareil myofonctionnel préfabriqué (Trainer et dispositifs similaires). Page dédiée : ce que dit la littérature, pour qui il est logique, et ce qu'il ne fait pas.
      </PageHead>

      <div className="card">
        <h2>En une phrase</h2>
        <p>{a.summary}</p>
        <div className="legend" style={{ marginBottom: 6 }}>
          <span className="tag">{a.family}</span>
          <span className="tag">Preuve : {a.evidenceGrade}</span>
        </div>
        <p className="small muted">{a.alsoKnownAs}</p>
      </div>

      <div className="card">
        <h2>Pour le cas en cours</h2>
        {v && res.mode !== 'abstention' ? (
          <>
            <p>
              Statut selon les données saisies : <StatusPill status={v.status} />
            </p>
            <button className="btn small" onClick={() => go('analyse')}>
              Voir le raisonnement complet
            </button>
          </>
        ) : (
          <p className="muted">
            Aucun cas complet n'est saisi : le guide ne devine pas.{' '}
            <button className="btn ghost small" onClick={() => go('analyse')}>
              Saisir ou charger un cas
            </button>
          </p>
        )}
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h2>Éducateur fonctionnel vs activateur</h2>
          <p className="small muted">Essai randomisé de 60 enfants (8–12 ans), 12 mois, Classe II division 1 (Idris 2019). Court terme, sans aveugle, essai non enregistré.</p>
          <Bars
            title="Réduction de l'ANB (plus la barre est longue, plus l'effet est grand)"
            unit="°"
            rows={[
              { label: 'Éducateur (T4K)', v: 0.9, cls: 't' },
              { label: 'Activateur', v: 1.89, cls: 'a' },
            ]}
          />
          <Bars
            title="Réduction de l'overjet"
            unit="mm"
            rows={[
              { label: 'Éducateur (T4K)', v: 1.5, cls: 't' },
              { label: 'Activateur', v: 3.0, cls: 'a' },
            ]}
          />
          <SourceChips ids={['idris2019']} />
        </div>
        <div className="card">
          <h2>Ce que montrent les synthèses</h2>
          <ClaimList
            claims={[
              { text: 'Vs aucun traitement (un seul essai) : overjet −2,4 mm, overbite −2,5 mm.', level: 'A', sources: ['papageorgiou2019'] },
              { text: 'Vs appareils sur mesure : moins efficace sur l\'ANB (+0,9°), la branche montante (−2,2 mm) et l\'overjet (+1,5 mm).', level: 'A', sources: ['papageorgiou2019'] },
              { text: 'À court terme, les activateurs corrigent mieux l\'overjet (+1,1 mm) ; pas de différence à long terme ; avantage principal = coût.', level: 'A', sources: ['mohammed2020'] },
            ]}
          />
        </div>
      </div>

      <div className="card">
        <h2>Les études, une par une</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Étude</th>
              <th>Type</th>
              <th>Population</th>
              <th>Résultat</th>
              <th>Limite</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><SourceChips ids={['usumez2004']} /></td>
              <td>Étude contrôlée</td>
              <td>20 traités (9,6 ans) vs 20 témoins</td>
              <td>vs témoins : seuls hauteur faciale totale, proclinaison inférieure et overjet diffèrent</td>
              <td>Non randomisée, ~13 mois</td>
            </tr>
            <tr>
              <td><SourceChips ids={['idris2019']} /></td>
              <td>Essai randomisé</td>
              <td>60 enfants de 8–12 ans</td>
              <td>Activateur supérieur : ANB −1,89° vs −0,9°, overjet −3,0 vs −1,5 mm</td>
              <td>12 mois, sans aveugle, non enregistré</td>
            </tr>
            <tr>
              <td><SourceChips ids={['idris2012']} /></td>
              <td>Essai randomisé</td>
              <td>54 patients</td>
              <td>Plus de pression, de sensibilité, de gêne orale et de trouble de l'élocution avec le Trainer</td>
              <td>Questionnaire ; 6 mois</td>
            </tr>
            <tr>
              <td><SourceChips ids={['papageorgiou2019']} /></td>
              <td>Revue + méta-analyses</td>
              <td>7 publications, 232 patients</td>
              <td>Efficace vs rien ; moins efficace que les appareils sur mesure ; coût inférieur</td>
              <td>Qualité modérée à faible</td>
            </tr>
            <tr>
              <td><SourceChips ids={['mohammed2020']} /></td>
              <td>Revue systématique</td>
              <td>3 essais + 3 études non randomisées</td>
              <td>Activateurs plus efficaces à court terme ; pas de différence à long terme</td>
              <td>Qualité faible</td>
            </tr>
            <tr>
              <td><SourceChips ids={['amat2023']} /></td>
              <td>Revue systématique</td>
              <td>14 études (rééducation myofonctionnelle)</td>
              <td>Résultats chiffrés portent sur l'apnée du sommeil de l'enfant, pas sur la Classe II</td>
              <td>12 études à risque de biais élevé</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h2>Quand il est le plus logique</h2>
          <ClaimList claims={a.mostLogical} />
        </div>
        <div className="card">
          <h2>Quand il est déconseillé</h2>
          <ClaimList claims={a.discouraged} />
        </div>
      </div>
      <div className="grid cols-2">
        <div className="card">
          <h2>Ce qu'il ne fait pas</h2>
          <ClaimList claims={a.doesNot} />
        </div>
        <div className="card">
          <h2>Coopération et effets indésirables</h2>
          <ClaimList claims={[...a.cooperation, ...a.adverse]} />
        </div>
      </div>
      <div className="card">
        <h2>Incertitudes du guide sur cet appareil</h2>
        <ul>
          {a.uncertainties.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
        <EvidenceLegend />
      </div>
    </>
  );
}
