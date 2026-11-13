import { useMemo } from 'react';
import type { CaseInput, Finding, Result, Verdict } from '../types';
import { analyze, REQUIRED_FIELDS } from '../engine/engine';
import { APPLIANCE_BY_ID } from '../data/appliances';
import { CASES } from '../data/cases';
import { LevelBadge, PageHead, SourceChips, StatusPill, ClaimList, useApp } from '../components/ui';

type Opt = [string, string];

const DENTITION: Opt[] = [
  ['temporaire', 'Temporaire'],
  ['mixte_precoce', 'Mixte précoce'],
  ['mixte_tardive', 'Mixte tardive'],
  ['permanente_jeune', 'Permanente jeune'],
  ['permanente', 'Permanente'],
];
const CVM: Opt[] = [
  ['CS1', 'CS1 (prépubertaire)'],
  ['CS2', 'CS2 (prépubertaire)'],
  ['CS3', 'CS3 (circumpubertaire)'],
  ['CS4', 'CS4 (circumpubertaire)'],
  ['CS5', 'CS5 (postpubertaire)'],
  ['CS6', 'CS6 (postpubertaire)'],
  ['non_evalue', 'Non évalué'],
];

function Num({ f, label, unit, input, set, step = 0.5, hint }: { f: keyof CaseInput; label: string; unit: string; input: CaseInput; set: (i: CaseInput) => void; step?: number; hint?: string }) {
  const required = REQUIRED_FIELDS.some((r) => r.field === f);
  const v = input[f] as number | undefined;
  return (
    <div className={`field ${required && v === undefined ? 'missing' : ''}`}>
      <label>
        {label} {unit && <span className="muted">({unit})</span>} {required && <span className="req">*</span>}
      </label>
      <input
        type="number"
        step={step}
        value={v ?? ''}
        onChange={(e) => set({ ...input, [f]: e.target.value === '' ? undefined : Number(e.target.value) })}
      />
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

function Sel({ f, label, options, input, set, hint }: { f: keyof CaseInput; label: string; options: Opt[]; input: CaseInput; set: (i: CaseInput) => void; hint?: string }) {
  const required = REQUIRED_FIELDS.some((r) => r.field === f);
  const v = input[f] as string | undefined;
  return (
    <div className={`field ${required && !v ? 'missing' : ''}`}>
      <label>
        {label} {required && <span className="req">*</span>}
      </label>
      <select value={v ?? ''} onChange={(e) => set({ ...input, [f]: e.target.value === '' ? undefined : e.target.value } as CaseInput)}>
        <option value="">— non renseigné —</option>
        {options.map(([k, l]) => (
          <option key={k} value={k}>
            {l}
          </option>
        ))}
      </select>
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

const KIND_LABEL: Record<Finding['kind'], string> = {
  abstention: 'Abstention',
  'garde-fou': 'Garde-fou',
  pretraitement: 'Prétraitement',
  orientation: 'Orientation',
  information: 'Information',
};
const KIND_CLASS: Record<Finding['kind'], string> = {
  abstention: 'abst',
  'garde-fou': 'guard',
  pretraitement: 'pre',
  orientation: 'info',
  information: 'info',
};

function FindingCard({ f }: { f: Finding }) {
  return (
    <div className={`notice ${KIND_CLASS[f.kind]}`}>
      <h4>
        <span className="tag">{KIND_LABEL[f.kind]}</span> {f.title}
      </h4>
      <div>{f.text}</div>
      <div className="meta">
        <LevelBadge level={f.level} /> <SourceChips ids={f.sources} />
      </div>
    </div>
  );
}

function VerdictCard({ v }: { v: Verdict }) {
  const { go } = useApp();
  const a = APPLIANCE_BY_ID[v.applianceId];
  const sum = v.reasons.reduce((s, r) => s + r.weight, 0);
  return (
    <details className="verdict" open={v.status === 'piste'}>
      <summary>
        <span>
          <strong>{a.name}</strong>
          {v.applianceId === 'rme' && <span className="tag" style={{ marginLeft: 6 }}>prétraitement</span>}
          {v.applianceId === 'trainer' && <span className="tag" style={{ marginLeft: 6 }}>priorité Tunisie</span>}
        </span>
        <StatusPill status={v.status} />
      </summary>
      <div className="body">
        {v.needs.length > 0 && (
          <div className="notice abst" style={{ marginTop: 10 }}>
            <strong>À renseigner pour évaluer :</strong>
            <ul style={{ margin: '4px 0 0 18px' }}>
              {v.needs.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        )}
        {v.reasons.map((r, i) => (
          <div className="reason" key={i}>
            <span className={`w ${r.weight > 0 ? 'p' + r.weight : r.weight < 0 ? 'm' + -r.weight : 'z'}`}>{r.weight > 0 ? `+${r.weight}` : r.weight}</span>
            <div>
              {r.text} <span className="rid">{r.ruleId}</span>
              <div>
                <LevelBadge level={r.level} /> <SourceChips ids={r.sources} />
              </div>
            </div>
          </div>
        ))}
        {v.reasons.length > 0 && <div className="small muted" style={{ marginTop: 6 }}>Somme des poids : {sum > 0 ? `+${sum}` : sum} (pondération provisoire, à valider).</div>}
        <div className="donot">
          <strong>Ce qu'il ne fait pas :</strong> {a.doesNot[0].text} {a.doesNot[0].sources.length > 0 && <SourceChips ids={a.doesNot[0].sources} />}
        </div>
        <div style={{ marginTop: 8 }}>
          <button className="btn ghost small" onClick={() => go('appareils', v.applianceId)}>
            Ouvrir la fiche complète
          </button>
        </div>
      </div>
    </details>
  );
}

const MODE_LABEL: Record<Result['mode'], { t: string; c: string }> = {
  abstention: { t: 'Abstention : données obligatoires manquantes', c: 'abst' },
  partielle: { t: 'Analyse partielle : maturation non évaluée', c: 'warn' },
  analyse: { t: 'Analyse complète', c: 'info' },
  hors_perimetre: { t: 'Hors périmètre', c: 'abst' },
};

export function ResultPanel({ res, input }: { res: Result; input: CaseInput }) {
  const m = MODE_LABEL[res.mode];
  const groups: Array<[string, Finding[]]> = [
    ['Garde-fous', res.findings.filter((f) => f.kind === 'garde-fou')],
    ['Prétraitements', res.findings.filter((f) => f.kind === 'pretraitement')],
    ['Abstentions et données à renseigner', res.findings.filter((f) => f.kind === 'abstention')],
    ['Informations', res.findings.filter((f) => f.kind === 'information' || f.kind === 'orientation')],
  ];
  const optMissing = res.missing.filter((x) => !x.required);
  const reqMissing = res.missing.filter((x) => x.required);
  return (
    <div className="result">
      <div className={`notice ${m.c}`}>
        <strong>{m.t}</strong>
        <div className="small">Ce résultat est une aide à la réflexion pour le praticien, qui décide. Brouillon non validé par un clinicien.</div>
      </div>
      {reqMissing.length > 0 && (
        <div className="notice abst">
          <strong>Obligatoires à renseigner :</strong>
          <ul style={{ margin: '4px 0 0 18px' }}>
            {reqMissing.map((x) => (
              <li key={x.field}>
                <strong>{x.label}</strong> — <span className="muted">{x.why}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {res.doubts.length > 0 && (
        <div className="notice warn">
          <strong>Données douteuses à vérifier</strong>
          {res.doubts.map((d) => (
            <div key={d.label} style={{ marginTop: 4 }}>
              <em>{d.label}</em> : {d.detail}
            </div>
          ))}
        </div>
      )}
      {groups.map(([t, list]) =>
        list.length > 0 ? (
          <div key={t}>
            <h3 style={{ marginTop: 14 }}>{t}</h3>
            {list.map((f) => (
              <FindingCard key={f.id} f={f} />
            ))}
          </div>
        ) : null,
      )}
      {res.verdicts.length > 0 && (
        <>
          <h3 style={{ marginTop: 18 }}>Pistes à considérer</h3>
          <p className="small muted">
            Classement par adéquation avec les données saisies. Chaque statut s'explique raison par raison, avec le niveau de preuve et les sources.
          </p>
          {res.verdicts.map((v) => (
            <VerdictCard key={v.applianceId} v={v} />
          ))}
          <h3 style={{ marginTop: 18 }}>Critères de réévaluation</h3>
          <ClaimList claims={res.reevaluation} />
          <h3 style={{ marginTop: 18 }}>Plan B</h3>
          <ClaimList claims={res.planB} />
        </>
      )}
      {optMissing.length > 0 && res.mode !== 'abstention' && (
        <p className="small muted" style={{ marginTop: 14 }}>
          Non renseigné : {optMissing.map((x) => x.label).join(', ')}.
        </p>
      )}
      <div className="card flat" style={{ marginTop: 16 }}>
        <h3>Traçabilité</h3>
        <p className="small">
          Guide Classe II, version brouillon 0.1 — analyse du {new Date().toLocaleString('fr-FR')}. Données saisies :{' '}
          {Object.entries(input)
            .filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0))
            .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join('+') : v}`)
            .join(' ; ') || 'aucune'}
          . Aucune donnée n'est enregistrée ni transmise : tout reste dans cette page.
        </p>
        <button className="btn ghost small no-print" onClick={() => window.print()}>
          Imprimer / enregistrer en PDF
        </button>
      </div>
    </div>
  );
}

export function AnalysePage() {
  const { input, setInput } = useApp();
  const res = useMemo(() => analyze(input), [input]);
  const set = setInput;
  const habits = input.habits ?? [];
  const toggleHabit = (h: NonNullable<CaseInput['habits']>[number]) =>
    set({ ...input, habits: habits.includes(h) ? habits.filter((x) => x !== h) : [...habits, h] });

  return (
    <>
      <PageHead title="Analyser un cas">
        Saisie du dossier clinique et radiologique. Le résultat se met à jour en direct. Les champs marqués * sont obligatoires : sans eux, le guide s'abstient plutôt que de deviner.
      </PageHead>
      <div className="card no-print">
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <select
            onChange={(e) => {
              const c = CASES.find((x) => x.id === e.target.value);
              if (c) set(c.input);
              e.target.value = '';
            }}
            defaultValue=""
          >
            <option value="">Charger un cas fictif de référence…</option>
            {CASES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.title}
              </option>
            ))}
          </select>
          <button className="btn ghost" onClick={() => set({})}>
            Réinitialiser
          </button>
        </div>
      </div>
      <div className="analysis">
        <div className="no-print">
          <div className="card">
            <h2>1. Profil</h2>
            <div className="form-grid">
              <Num f="age" label="Âge" unit="ans" input={input} set={set} step={0.5} />
              <Sel f="sex" label="Sexe (optionnel)" options={[['F', 'Féminin'], ['M', 'Masculin']]} input={input} set={set} />
              <Sel f="dentition" label="Stade de denture" options={DENTITION} input={input} set={set} />
              <Sel f="cvm" label="Maturation (CVM)" options={CVM} input={input} set={set} hint="Version CS1–CS6 (McNamara 2018). Fiabilité discutée." />
            </div>
          </div>
          <div className="card">
            <h2>2. Occlusion</h2>
            <div className="form-grid">
              <Sel f="division" label="Division" options={[['div1', 'Division 1'], ['div2', 'Division 2']]} input={input} set={set} />
              <Sel f="molar" label="Relation molaire" options={[['non_classe2', 'Non Classe II'], ['demi', 'Classe II demi-cuspide'], ['complete', 'Classe II cuspide entière']]} input={input} set={set} />
              <Num f="overjet" label="Overjet" unit="mm" input={input} set={set} />
              <Num f="overbite" label="Overbite" unit="mm" input={input} set={set} />
              <Sel f="transverse" label="Transversal" options={[['normal', 'Normal'], ['deficit', 'Endognathie maxillaire / croisement'], ['non_evalue', 'Non évalué']]} input={input} set={set} />
              <Sel f="lowerIncisors" label="Incisives inférieures" options={[['normales', 'Position normale'], ['proclinees', 'Déjà proclinées'], ['non_evalue', 'Non évaluées']]} input={input} set={set} hint="Jugement clinique ; l'IMPA est informatif." />
            </div>
          </div>
          <div className="card">
            <h2>3. Téléradiographie de profil</h2>
            <div className="form-grid">
              <Num f="sna" label="SNA" unit="°" input={input} set={set} />
              <Num f="snb" label="SNB" unit="°" input={input} set={set} />
              <Num f="anb" label="ANB" unit="°" input={input} set={set} />
              <Num f="wits" label="Wits" unit="mm" input={input} set={set} hint="Recommandé : l'ANB seul peut tromper." />
              <Num f="snGoGn" label="SN-GoGn" unit="°" input={input} set={set} hint="Informatif : la typologie est saisie ci-dessous." />
              <Num f="impa" label="IMPA" unit="°" input={input} set={set} hint="Informatif." />
              <Sel f="component" label="Composante dominante" options={[['dentaire', 'Dentaire'], ['maxillaire', 'Maxillaire (prognathie)'], ['mandibulaire', 'Mandibulaire (rétrognathie)'], ['combinee', 'Combinée']]} input={input} set={set} hint="Jugement du praticien." />
              <Sel f="vertical" label="Typologie verticale" options={[['hypo', 'Hypodivergent'], ['normo', 'Normodivergent'], ['hyper', 'Hyperdivergent']]} input={input} set={set} hint="Jugement du praticien : aucun seuil sourcé retrouvé." />
            </div>
          </div>
          <div className="card">
            <h2>4. Fonction, ATM, contexte</h2>
            <div className="form-grid">
              <Sel f="tmd" label="ATM" options={[['aucun', 'Aucun signe'], ['bruits', 'Bruits sans douleur'], ['douleur_limitation', 'Douleur ou limitation'], ['non_evalue', 'Non examinée']]} input={input} set={set} />
              <Sel f="airway" label="Voies aériennes" options={[['libre', 'Respiration nasale possible'], ['obstruction', 'Obstruction suspectée'], ['non_evalue', 'Non évaluées']]} input={input} set={set} />
              <Sel f="hygiene" label="Hygiène / caries" options={[['bonne', 'Bonne'], ['mediocre', 'Médiocre / caries actives'], ['non_evalue', 'Non évaluée']]} input={input} set={set} />
              <Sel f="cooperation" label="Coopération estimée" options={[['bonne', 'Bonne'], ['moyenne', 'Moyenne'], ['faible', 'Faible'], ['non_evalue', 'Non évaluée']]} input={input} set={set} />
              <Sel f="traumaHistory" label="Traumatisme incisif antérieur" options={[['non', 'Non'], ['oui', 'Oui'], ['non_evalue', 'Non évalué']]} input={input} set={set} />
            </div>
            <div className="field checks" style={{ marginTop: 10 }}>
              <label>Habitudes et fonctions</label>
              {(
                [
                  ['succion', 'Succion'],
                  ['respiration_buccale', 'Respiration buccale'],
                  ['deglutition_atypique', 'Déglutition atypique'],
                  ['posture_linguale', 'Posture linguale basse'],
                ] as const
              ).map(([k, l]) => (
                <label key={k}>
                  <input type="checkbox" checked={habits.includes(k)} onChange={() => toggleHabit(k)} /> {l}
                </label>
              ))}
            </div>
          </div>
        </div>
        <ResultPanel res={res} input={input} />
      </div>
    </>
  );
}
