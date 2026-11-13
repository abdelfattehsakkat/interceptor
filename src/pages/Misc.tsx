import { useState } from 'react';
import { DOCS } from '../data/docs';
import { VALIDATION, type Risk } from '../data/validation';
import { CASES } from '../data/cases';
import { analyze } from '../engine/engine';
import { APPLIANCE_BY_ID } from '../data/appliances';
import { SOURCES } from '../data/sources';
import { ClaimList, EvidenceLegend, LevelBadge, PageHead, SourceChips, StatusPill, useApp } from '../components/ui';

export function DocsPage() {
  const [id, setId] = useState(DOCS[0].id);
  const d = DOCS.find((x) => x.id === id)!;
  return (
    <>
      <PageHead title="Documentation">Connaissance métier utilisée par le guide, rédigée avec ses niveaux de preuve et ses limites.</PageHead>
      <div className="docnav">
        {DOCS.map((x) => (
          <button key={x.id} className={x.id === id ? 'active' : ''} onClick={() => setId(x.id)}>
            {x.title}
          </button>
        ))}
      </div>
      <div className="card">
        <h2>{d.title}</h2>
        <p className="muted">{d.intro}</p>
        {d.blocks.map((b, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            {b.heading && <h3>{b.heading}</h3>}
            {b.text?.map((t, k) => (
              <p key={k}>{t}</p>
            ))}
            {b.table && (
              <table className="table">
                <thead>
                  <tr>{b.table.head.map((h) => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {b.table.rows.map((r, k) => (
                    <tr key={k}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            )}
            {b.claims && <ClaimList claims={b.claims} />}
          </div>
        ))}
        <EvidenceLegend />
      </div>
    </>
  );
}

const RISK_CLASS: Record<Risk, string> = { élevé: 'risk-high', moyen: 'risk-mid', faible: 'risk-low' };

export function ValidationPage() {
  const order: Risk[] = ['élevé', 'moyen', 'faible'];
  return (
    <>
      <PageHead title="À valider par un clinicien">
        Points incertains ou controversés, avec les deux positions et leurs sources, classés par risque clinique. Aucun n'est tranché par le guide sans relecture.
      </PageHead>
      {order.map((risk) => (
        <div key={risk}>
          <h2 style={{ marginTop: 18 }}>Risque {risk}</h2>
          {VALIDATION.filter((v) => v.risk === risk).map((v) => (
            <div key={v.id} className={`card ${RISK_CLASS[v.risk]}`}>
              <h3>
                {v.id} — {v.title}
              </h3>
              <p>{v.question}</p>
              <div className="two-pos">
                <div>
                  <strong>{v.positionA.label}</strong>
                  <p>{v.positionA.text}</p>
                  <SourceChips ids={v.positionA.sources} />
                </div>
                <div>
                  <strong>{v.positionB.label}</strong>
                  <p>{v.positionB.text}</p>
                  <SourceChips ids={v.positionB.sources} />
                </div>
              </div>
              <p className="small">
                <strong>Choix provisoire du guide :</strong> {v.currentChoice}
              </p>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

const TAG_LABEL = { typique: 'Typique', limite: 'Cas limite', contradictoire: 'Contradictoire', abstention: 'Abstention' } as const;

export function CasesPage() {
  const { setInput, go } = useApp();
  return (
    <>
      <PageHead title="Cas de référence">
        {CASES.length} cas fictifs, dont des cas limites et contradictoires. Chacun a une réponse attendue et un raisonnement ; ils servent de tests automatiques et de support à la validation par un clinicien.
      </PageHead>
      {CASES.map((c) => {
        const res = analyze(c.input);
        return (
          <div className="card" key={c.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <h3>
                {c.id} — {c.title}
              </h3>
              <span>
                <span className="tag">{TAG_LABEL[c.tag]}</span>
                <button
                  className="btn small"
                  onClick={() => {
                    setInput(c.input);
                    go('analyse');
                  }}
                >
                  Charger dans l'analyse
                </button>
              </span>
            </div>
            <p className="small muted">
              Âge {c.input.age} ans · {c.input.dentition} · {c.input.cvm} · overjet {c.input.overjet} mm · composante {c.input.component}
            </p>
            <p>{c.reasoning}</p>
            <div className="small">
              <strong>Sortie attendue :</strong> mode « {c.expectMode} »{' '}
              {Object.entries(c.expect).map(([k, v]) => (
                <span key={k} style={{ marginRight: 8 }}>
                  {APPLIANCE_BY_ID[k as keyof typeof APPLIANCE_BY_ID].name.split('(')[0].trim()} <StatusPill status={v} />
                </span>
              ))}
              {c.expectDoubt && <> · doute : « {c.expectDoubt} »</>}
              <span className="muted"> · mode obtenu : {res.mode}</span>
            </div>
          </div>
        );
      })}
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHead title="Limites et cadre d'emploi">À lire avant d'utiliser le guide.</PageHead>
      <div className="card">
        <h2>Ce que ce guide est</h2>
        <ClaimList
          claims={[
            { text: 'Un outil d\'aide à la réflexion pour orthodontistes : il organise les données du dossier, les règles et les sources. Le praticien décide.', level: 'C', sources: [] },
            { text: 'Un brouillon : aucune règle n\'a encore été validée par un clinicien ; voir « À valider ».', level: 'C', sources: [] },
            { text: 'Un outil sans stockage : aucune donnée n\'est enregistrée ni transmise ; tout reste dans la page ouverte.', level: 'C', sources: [] },
          ]}
        />
      </div>
      <div className="card">
        <h2>Ce que ce guide n'est pas</h2>
        <ul>
          <li>Il ne recommande pas de traitement personnalisé pour un patient réel.</li>
          <li>Il ne remplace ni l'examen clinique, ni le jugement du praticien, ni le consentement des parents.</li>
          <li>Il n'affirme pas avoir un statut de dispositif médical ni en être dispensé : le cadre réglementaire est traité à part.</li>
          <li>Il ne contient aucune fréquence de complication ni aucun seuil chiffré sans source ; en l'absence de source, il l'écrit « NON SOURCÉ ».</li>
        </ul>
      </div>
      <div className="card">
        <h2>Méthode documentaire</h2>
        <p>
          {SOURCES.length} références vérifiées dans PubMed (identifiant, titre, revue, DOI). {SOURCES.filter((s) => s.abstractRead).length} dont le résumé a été relu pour rédiger ce qu'elles établissent ; pour les autres, le guide se limite à ce que dit le titre. Plusieurs identifiants de mémoire se sont révélés faux lors de la vérification et ont été écartés.
        </p>
        <EvidenceLegend />
      </div>
      <div className="card">
        <h2>Limites connues</h2>
        <ul>
          <li>La plupart des études portent sur la division 1, à court terme, avec des preuves de faible à modérée qualité.</li>
          <li>La CVM est controversée ; une relecture du stade par un second observateur est prudente.</li>
          <li>Aucune norme céphalométrique tunisienne exploitable n'a été retrouvée.</li>
          <li>Disponibilité réelle des appareils en Tunisie : non modélisée.</li>
          <li>Les poids des règles sont provisoires.</li>
        </ul>
        <p className="small muted">
          Niveau des références : <LevelBadge level="A" /> études, <LevelBadge level="B" /> consensus.
        </p>
      </div>
    </>
  );
}
