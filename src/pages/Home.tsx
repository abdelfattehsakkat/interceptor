import { APPLIANCES } from '../data/appliances';
import { CASES } from '../data/cases';
import { SOURCES } from '../data/sources';
import { VALIDATION } from '../data/validation';
import { EvidenceLegend, useApp } from '../components/ui';

export function HomePage() {
  const { go } = useApp();
  return (
    <>
      <div className="hero">
        <h1>Guide de décision en Classe II squelettique</h1>
        <p>
          De la saisie du dossier clinique et radiologique à une réflexion argumentée : pourquoi une piste est logique, ce qu'elle ne fait pas, avec les sources et leur niveau de preuve. Quand une donnée manque, le guide s'abstient et dit quoi renseigner.
        </p>
        <div className="cta">
          <button className="btn" onClick={() => go('analyse')}>Analyser un cas</button>
          <button className="btn secondary" onClick={() => go('educateur')}>Éducateur fonctionnel</button>
          <button className="btn secondary" onClick={() => go('litterature')}>Parcourir la littérature</button>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 16 }}>
        <div className="card kpi"><div className="v">{SOURCES.length}</div><div className="l">références vérifiées dans PubMed</div></div>
        <div className="card kpi"><div className="v">{APPLIANCES.length}</div><div className="l">fiches d'options thérapeutiques</div></div>
        <div className="card kpi"><div className="v">{CASES.length}</div><div className="l">cas de référence testés automatiquement</div></div>
        <div className="card kpi"><div className="v">{VALIDATION.length}</div><div className="l">points à valider par un clinicien</div></div>
      </div>

      <div className="grid cols-3">
        <div className="card">
          <h2>1. Saisir</h2>
          <p>Âge, denture, maturation, occlusion, mesures céphalométriques, ATM, coopération. Le résultat se met à jour en direct.</p>
        </div>
        <div className="card">
          <h2>2. Comprendre</h2>
          <p>Garde-fous, prétraitements, puis pistes classées. Chaque statut s'explique raison par raison, avec le niveau de preuve.</p>
        </div>
        <div className="card">
          <h2>3. Vérifier</h2>
          <p>Chaque affirmation renvoie à une publication vérifiée. Ce qui n'a pas de source est marqué « NON SOURCÉ ».</p>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h2>Éducateur fonctionnel</h2>
          <p>
            Priorité de ce guide. Les essais montrent une réduction de l'overjet surtout dentoalvéolaire, inférieure à celle des appareils sur mesure ; son avantage documenté est le coût. Page dédiée avec comparaison, études une par une et limites.
          </p>
          <button className="btn" onClick={() => go('educateur')}>Ouvrir la page dédiée</button>
        </div>
        <div className="card">
          <h2>Ce que la littérature dit du moment</h2>
          <p>
            Un traitement précoce en deux phases n'améliore pas le résultat final par rapport à un traitement unique à l'adolescence ; il réduit les traumatismes des incisives. L'effet squelettique des fonctionnels est le plus net au pic pubertaire.
          </p>
          <button className="btn ghost" onClick={() => go('documentation')}>Lire la documentation</button>
        </div>
      </div>

      <div className="card">
        <h2>Niveaux de preuve</h2>
        <EvidenceLegend />
        <p className="small muted" style={{ marginTop: 10 }}>
          Brouillon destiné à être validé par un orthodontiste. Aucune donnée n'est enregistrée : tout reste dans la page.
        </p>
      </div>
    </>
  );
}
