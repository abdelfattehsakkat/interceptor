import type { ApplianceId } from './data/appliances';

export type Level = 'A' | 'B' | 'C' | 'NS';

export const LEVEL_LABEL: Record<Level, string> = {
  A: 'Preuve issue d\'études',
  B: 'Consensus / enseignement classique',
  C: 'Opinion / pratique locale',
  NS: 'Non sourcé',
};

export type SourceType =
  | 'Revue Cochrane'
  | 'Méta-analyse'
  | 'Revue systématique'
  | 'Revue de portée'
  | 'Essai randomisé'
  | 'Étude contrôlée'
  | 'Étude de cohorte / série'
  | 'Étude de fiabilité'
  | 'Revue narrative'
  | 'Article fondateur'
  | 'Recommandation';

export type Theme =
  | 'Éducateur fonctionnel'
  | 'Timing & maturation'
  | 'Appareils amovibles'
  | 'Appareils fixes'
  | 'Orthopédie maxillaire'
  | 'Aligneurs'
  | 'Camouflage'
  | 'Diagnostic & céphalométrie'
  | 'ATM'
  | 'Traumatisme'
  | 'Parodonte'
  | 'Imagerie'
  | 'Coopération'
  | 'Tunisie';

export interface Source {
  id: string;
  authors: string;
  title: string;
  journal: string;
  year: number;
  ref: string;
  pmid: string;
  doi?: string;
  type: SourceType;
  themes: Theme[];
  /** Ce que la source établit, tel que lu dans le résumé PubMed. */
  establishes: string;
  /** Le résumé a été lu en entier pour rédiger la ligne ci-dessus. */
  abstractRead: boolean;
}

/** Une affirmation du guide, toujours reliée à un niveau et à ses sources. */
export interface Claim {
  text: string;
  level: Level;
  sources: string[];
  note?: string;
}

export type FindingKind = 'abstention' | 'garde-fou' | 'pretraitement' | 'orientation' | 'information';

export interface Finding {
  id: string;
  kind: FindingKind;
  title: string;
  text: string;
  level: Level;
  sources: string[];
}

export type Status = 'piste' | 'reserves' | 'peu_adapte' | 'deconseille' | 'non_evaluable';

export const STATUS_LABEL: Record<Status, string> = {
  piste: 'Piste logique',
  reserves: 'Possible avec réserves',
  peu_adapte: 'Peu adapté',
  deconseille: 'Déconseillé dans ce profil',
  non_evaluable: 'Non évaluable (donnée manquante)',
};

export interface Reason {
  ruleId: string;
  /** +2 favorable fort, +1 favorable, 0 neutre/info, -1 réserve, -2 défavorable fort */
  weight: -2 | -1 | 0 | 1 | 2;
  text: string;
  level: Level;
  sources: string[];
}

export interface Verdict {
  applianceId: ApplianceId;
  status: Status;
  reasons: Reason[];
  /** Données à renseigner pour lever un « non évaluable ». */
  needs: string[];
}

export interface CaseInput {
  age?: number;
  sex?: 'F' | 'M';
  dentition?: 'temporaire' | 'mixte_precoce' | 'mixte_tardive' | 'permanente_jeune' | 'permanente';
  cvm?: 'CS1' | 'CS2' | 'CS3' | 'CS4' | 'CS5' | 'CS6' | 'non_evalue';
  division?: 'div1' | 'div2';
  molar?: 'non_classe2' | 'demi' | 'complete';
  overjet?: number;
  overbite?: number;
  sna?: number;
  snb?: number;
  anb?: number;
  wits?: number;
  snGoGn?: number;
  impa?: number;
  component?: 'dentaire' | 'maxillaire' | 'mandibulaire' | 'combinee';
  vertical?: 'hypo' | 'normo' | 'hyper';
  transverse?: 'normal' | 'deficit' | 'non_evalue';
  lowerIncisors?: 'normales' | 'proclinees' | 'non_evalue';
  tmd?: 'aucun' | 'bruits' | 'douleur_limitation' | 'non_evalue';
  airway?: 'libre' | 'obstruction' | 'non_evalue';
  habits?: Array<'succion' | 'respiration_buccale' | 'deglutition_atypique' | 'posture_linguale'>;
  hygiene?: 'bonne' | 'mediocre' | 'non_evalue';
  cooperation?: 'bonne' | 'moyenne' | 'faible' | 'non_evalue';
  traumaHistory?: 'non' | 'oui' | 'non_evalue';
}

export type GrowthPhase = 'pre' | 'pubertaire' | 'post' | 'inconnue';

export interface MissingItem {
  field: string;
  label: string;
  why: string;
  required: boolean;
}

export interface DoubtItem {
  label: string;
  detail: string;
}

export interface Result {
  mode: 'abstention' | 'partielle' | 'analyse' | 'hors_perimetre';
  missing: MissingItem[];
  doubts: DoubtItem[];
  phase: GrowthPhase;
  findings: Finding[];
  verdicts: Verdict[];
  reevaluation: Claim[];
  planB: Claim[];
}
