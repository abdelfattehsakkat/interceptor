import type {
  CaseInput,
  Claim,
  DoubtItem,
  Finding,
  GrowthPhase,
  MissingItem,
  Reason,
  Result,
  Status,
  Verdict,
} from '../types';
import type { ApplianceId } from '../data/appliances';

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export const REQUIRED_FIELDS: Array<{ field: keyof CaseInput; label: string; why: string }> = [
  { field: 'age', label: 'Âge (années)', why: 'Cadre de population des études (8–12 ans pour la majorité des essais) et contrôle de cohérence avec la denture et la maturation.' },
  { field: 'dentition', label: 'Stade de denture', why: 'Conditionne la faisabilité technique et la population des études.' },
  { field: 'division', label: 'Division (1 ou 2)', why: 'Les essais retrouvés portent surtout sur la division 1 ; la division 2 sort du champ des preuves.' },
  { field: 'molar', label: 'Relation molaire', why: 'Confirme que le dossier relève bien de la Classe II.' },
  { field: 'overjet', label: 'Overjet (mm)', why: 'Critère clé du risque traumatique et de la sévérité.' },
  { field: 'sna', label: 'SNA (°)', why: 'Orientation de la composante maxillaire.' },
  { field: 'snb', label: 'SNB (°)', why: 'Orientation de la composante mandibulaire.' },
  { field: 'anb', label: 'ANB (°)', why: 'Importance de la discordance sagittale ; sert aussi au contrôle de cohérence SNA − SNB.' },
  { field: 'component', label: 'Composante dominante (jugement clinique)', why: 'Détermine quel appareil agit sur le bon maxillaire. C\'est le praticien qui tranche : la littérature montre que le résultat dépend de l\'indicateur céphalométrique choisi.' },
  { field: 'vertical', label: 'Typologie verticale (jugement clinique)', why: 'Un seuil chiffré fiable de divergence n\'a pas été retrouvé : le guide le demande donc au praticien.' },
  { field: 'cvm', label: 'Stade de maturation (CVM CS1–CS6, ou « non évalué »)', why: 'La fenêtre de croissance conditionne l\'effet squelettique des appareils fonctionnels.' },
];

export const RECOMMENDED_FIELDS: Array<{ field: keyof CaseInput; label: string; why: string }> = [
  { field: 'tmd', label: 'ATM', why: 'Garde-fou avant tout appareil de position mandibulaire.' },
  { field: 'transverse', label: 'Transversal', why: 'Un déficit transversal justifie un prétraitement.' },
  { field: 'lowerIncisors', label: 'Incisives inférieures', why: 'Risque de proclinaison supplémentaire.' },
  { field: 'cooperation', label: 'Coopération estimée', why: 'Conditionne l\'appareil (amovible vs fixe).' },
  { field: 'airway', label: 'Voies aériennes / respiration', why: 'Suspicion d\'obstruction à explorer avant un appareil myofonctionnel.' },
  { field: 'hygiene', label: 'Hygiène / caries', why: 'Garde-fou pour les appareils fixes.' },
  { field: 'traumaHistory', label: 'Antécédent de traumatisme incisif', why: 'Argument en faveur d\'une intervention précoce.' },
  { field: 'wits', label: 'Wits (mm)', why: 'L\'ANB seul peut tromper (Hussels 1984).' },
];

const MIXED = ['temporaire', 'mixte_precoce', 'mixte_tardive'];

export function growthPhase(cvm: CaseInput['cvm']): GrowthPhase {
  if (cvm === 'CS1' || cvm === 'CS2') return 'pre';
  if (cvm === 'CS3' || cvm === 'CS4') return 'pubertaire';
  if (cvm === 'CS5' || cvm === 'CS6') return 'post';
  return 'inconnue';
}

function missingOf(input: CaseInput) {
  const absent = (f: keyof CaseInput) => {
    const v = input[f];
    return v === undefined || v === null || (typeof v === 'number' && !Number.isFinite(v));
  };
  const required: MissingItem[] = REQUIRED_FIELDS.filter((f) => absent(f.field)).map((f) => ({ ...f, field: String(f.field), required: true }));
  const optional: MissingItem[] = RECOMMENDED_FIELDS.filter(
    (f) => absent(f.field) || (input[f.field] as unknown) === 'non_evalue',
  ).map((f) => ({ ...f, field: String(f.field), required: false }));
  return { required, optional };
}

function checkConsistency(input: CaseInput): DoubtItem[] {
  const d: DoubtItem[] = [];
  const { sna, snb, anb, age, dentition, cvm, overjet } = input;
  if (isNum(sna) && isNum(snb) && isNum(anb) && Math.abs(sna - snb - anb) > 1) {
    d.push({
      label: 'SNA − SNB ≠ ANB',
      detail: `SNA − SNB = ${(sna - snb).toFixed(1)}° alors que l'ANB saisi est ${anb}°. L'ANB est par définition SNA − SNB : une des trois valeurs est probablement erronée. Contrôle arithmétique, sans seuil clinique.`,
    });
  }
  if (isNum(age) && dentition) {
    const bad =
      (dentition === 'permanente' && age < 10) ||
      (dentition === 'temporaire' && age > 8) ||
      (dentition === 'mixte_precoce' && age > 11) ||
      (dentition === 'mixte_tardive' && age < 8);
    if (bad) {
      d.push({
        label: 'Âge et denture peu compatibles',
        detail: `Âge ${age} ans avec denture « ${dentition} » : vérifier la saisie. Contrôle de plausibilité indicatif, non sourcé.`,
      });
    }
  }
  if (isNum(age) && cvm && cvm !== 'non_evalue') {
    const ph = growthPhase(cvm);
    if ((ph === 'post' && age < 9) || (ph === 'pre' && age >= 14)) {
      d.push({
        label: 'Âge et stade CVM peu compatibles',
        detail: `Âge ${age} ans avec stade ${cvm} : variation individuelle possible, mais à vérifier (relecture du stade). Contrôle de plausibilité indicatif, non sourcé.`,
      });
    }
  }
  if (isNum(overjet) && (overjet < 0 || overjet > 15)) {
    d.push({ label: 'Overjet inhabituel', detail: `Overjet de ${overjet} mm : valeur à confirmer (saisie ou cas hors Classe II division 1).` });
  }
  if (input.molar === 'non_classe2') {
    d.push({
      label: 'Relation molaire non Classe II',
      detail: 'Une Classe II squelettique ou canine peut exister avec une relation molaire différente ; vérifier que le dossier relève bien de ce guide.',
    });
  }
  return d;
}

type R = Reason;
const r = (ruleId: string, weight: R['weight'], text: string, level: R['level'], sources: string[] = []): R => ({
  ruleId,
  weight,
  text,
  level,
  sources,
});

interface Ctx {
  i: CaseInput;
  phase: GrowthPhase;
  mixed: boolean;
  traumaFlag: boolean;
  tmdUnknown: boolean;
}

function commonCoop(ctx: Ctx, p: { faible: number; moyenne: number; bonne: number }, src: string[], ruleId: string): R[] {
  const c = ctx.i.cooperation;
  const map = (w: number) => w as R['weight'];
  if (c === 'faible') return [r(ruleId, map(p.faible), 'Coopération estimée faible.', 'A', src)];
  if (c === 'moyenne') return [r(ruleId, map(p.moyenne), 'Coopération estimée moyenne.', 'A', src)];
  if (c === 'bonne') return [r(ruleId, map(p.bonne), 'Coopération estimée bonne.', 'A', src)];
  return [];
}

function commonTmd(ctx: Ctx): R[] {
  const t = ctx.i.tmd;
  if (t === 'douleur_limitation') {
    return [
      r('G-ATM', -2, 'Douleur ou limitation de l\'ATM : bilan et stabilisation avant un appareil de position mandibulaire (consensus).', 'B', ['kim2002', 'michelotti2010']),
    ];
  }
  if (t === 'bruits') {
    return [r('G-ATM', 0, 'Bruits articulaires : surveillance ; pas de preuve que l\'orthodontie augmente la prévalence des DTM (hétérogénéité majeure).', 'A', ['kim2002'])];
  }
  return [];
}

type Rule = (ctx: Ctx) => R[];

const ADVANCEMENT: ApplianceId[] = ['activator', 'twinblock', 'frankel', 'fixed_functional', 'aligner_ma'];
const TIMING_DEPENDENT: ApplianceId[] = ['activator', 'twinblock', 'frankel', 'fixed_functional', 'headgear', 'aligner_ma', 'elastics', 'distalization'];
const EVIDENCE_CAP: ApplianceId[] = ['aligner_ma', 'frankel'];

const RULES: Record<ApplianceId, Rule> = {
  trainer: (c) => {
    const { i, phase } = c;
    const out: R[] = [];
    if (c.mixed) out.push(r('T-DENT', 1, 'Denture mixte : population des essais (8–12 ans).', 'A', ['idris2019', 'usumez2004', 'papageorgiou2019']));
    else out.push(r('T-DENT', -1, 'Denture permanente : aucune donnée retrouvée sur le trainer à cet âge.', 'NS'));
    if (i.component === 'dentaire') out.push(r('T-COMP', 2, 'Composante dentoalvéolaire : l\'effet démontré est essentiellement dentoalvéolaire.', 'A', ['usumez2004', 'papageorgiou2019']));
    else if (i.component === 'mandibulaire' || i.component === 'combinee')
      out.push(r('T-COMP', -1, 'Composante mandibulaire : les appareils sur mesure donnent plus d\'effet squelettique (ANB, branche montante).', 'A', ['papageorgiou2019', 'idris2019']));
    else if (i.component === 'maxillaire') out.push(r('T-COMP', -1, 'Composante maxillaire : aucune donnée retrouvée sur un effet maxillaire du trainer.', 'NS'));
    if (phase === 'pubertaire' && (i.component === 'mandibulaire' || i.component === 'combinee'))
      out.push(r('T-PUB', -1, 'Au pic pubertaire, un appareil sur mesure exploite mieux la fenêtre de croissance mandibulaire.', 'A', ['baccetti2000', 'perinetti2015rfa']));
    if (phase === 'post') out.push(r('T-POST', -2, 'Croissance terminée : effet dentoalvéolaire seulement, hors population des études.', 'NS'));
    out.push(...commonCoop(c, { faible: -2, moyenne: -1, bonne: 1 }, ['mohammed2020', 'idris2012'], 'T-COOP'));
    if (i.lowerIncisors === 'proclinees') out.push(r('G-INCINF', -2, 'Incisives inférieures déjà proclinées : proclinaison inférieure supplémentaire significative rapportée.', 'A', ['usumez2004']));
    if (i.vertical === 'hyper') out.push(r('T-VERT', -1, 'Hyperdivergence : hausse significative de la hauteur faciale totale rapportée vs témoins.', 'A', ['usumez2004']));
    if (i.habits && i.habits.length > 0) out.push(r('T-HAB', 1, 'Dysfonction orale associée : justification myofonctionnelle (efficacité sur l\'habitude non établie).', 'B', ['idris2019']));
    if (i.airway === 'obstruction') out.push(r('G-VOIES', -1, 'Obstruction nasale suspectée : avis ORL avant un appareil buccal.', 'NS'));
    out.push(...commonTmd(c).map((x) => (x.weight === -2 ? { ...x, weight: -1 as const } : x)));
    return out;
  },
  activator: (c) => {
    const { i, phase } = c;
    const out: R[] = [];
    if (phase === 'pubertaire') out.push(r('A-PHASE', 2, 'Pic pubertaire : gain mandibulaire ~2,9 mm vs ~1 mm en prépubère.', 'A', ['perinetti2015rfa', 'cozza2006']));
    else if (phase === 'pre') out.push(r('A-PHASE', -1, 'Prépubère : gain mandibulaire faible ; pas d\'avantage final sur un traitement tardif (sauf traumatismes).', 'A', ['perinetti2015rfa', 'batista2018']));
    else if (phase === 'post') out.push(r('A-PHASE', -2, 'Croissance terminée : effet squelettique non démontré.', 'A', ['perinetti2015ffa']));
    if (i.component === 'mandibulaire' || i.component === 'combinee') out.push(r('A-COMP', 1, 'Composante mandibulaire : indication classique des fonctionnels.', 'A', ['koretsi2015']));
    else if (i.component === 'maxillaire') out.push(r('A-COMP', -1, 'Composante maxillaire : action sur SNA minime (−0,28°/an).', 'A', ['koretsi2015']));
    else if (i.component === 'dentaire') out.push(r('A-COMP', 0, 'Composante dentaire : effet surtout dentoalvéolaire de toute façon.', 'A', ['koretsi2015']));
    out.push(...commonCoop(c, { faible: -2, moyenne: -1, bonne: 1 }, ['wheeler2002'], 'A-COOP'));
    out.push(...commonTmd(c));
    if (i.lowerIncisors === 'proclinees') out.push(r('G-INCINF', -1, 'Incisives inférieures déjà proclinées : proclinaison supplémentaire possible (non sourcé pour l\'activateur).', 'NS'));
    return out;
  },
  twinblock: (c) => {
    const { i, phase } = c;
    const out: R[] = [];
    if (phase === 'pubertaire') out.push(r('TB-PHASE', 2, 'Pic pubertaire : moment optimal rapporté (contribution squelettique plus grande).', 'A', ['baccetti2000']));
    else if (phase === 'pre') out.push(r('TB-PHASE', -1, 'Prépubère : correction surtout dentoalvéolaire ; aucun avantage sur un traitement unique à l\'adolescence à 10 ans.', 'A', ['obrien2003tb', 'obrien2009']));
    else if (phase === 'post') out.push(r('TB-PHASE', -2, 'Croissance terminée : effet squelettique non démontré.', 'A', ['perinetti2015ffa']));
    if (i.component === 'mandibulaire' || i.component === 'combinee') out.push(r('TB-COMP', 1, 'Composante mandibulaire : effets squelettiques plus marqués avec le Twin Block.', 'A', ['koretsi2015']));
    else if (i.component === 'maxillaire') out.push(r('TB-COMP', -1, 'Composante maxillaire : action sur SNA minime.', 'A', ['koretsi2015']));
    out.push(...commonCoop(c, { faible: -2, moyenne: -1, bonne: 1 }, ['obrien2003herbst', 'pacha2024'], 'TB-COOP'));
    out.push(...commonTmd(c));
    if (i.lowerIncisors === 'proclinees') out.push(r('G-INCINF', -1, 'Incisives inférieures déjà proclinées : proclinaison supplémentaire possible (non sourcé pour le Twin Block).', 'NS'));
    return out;
  },
  frankel: (c) => {
    const { i, phase } = c;
    const out: R[] = [r('F-BASE', -1, 'Peu de sources retrouvées (un essai ancien, une étude de 14 patients).', 'A', ['perillo1996', 'ghafari1998'])];
    if (phase === 'post') out.push(r('F-PHASE', -2, 'Croissance terminée : extrapolation depuis les autres appareils amovibles.', 'NS'));
    else if (phase === 'pubertaire') out.push(r('F-PHASE', 1, 'Pic pubertaire : extrapolation depuis les appareils amovibles.', 'A', ['perinetti2015rfa']));
    else if (phase === 'pre') out.push(r('F-PHASE', 0, 'Prépubère : efficacité rapportée dans l\'essai vs FEO.', 'A', ['ghafari1998']));
    if (i.component === 'mandibulaire') out.push(r('F-COMP', 1, 'Mandibule rétrusive : diminution de l\'ANB et plus de croissance mandibulaire (14 patients).', 'A', ['perillo1996']));
    else if (i.component === 'maxillaire') out.push(r('F-COMP', -1, 'Pas d\'effet maxillaire noté.', 'A', ['perillo1996']));
    out.push(...commonCoop(c, { faible: -2, moyenne: -1, bonne: 1 }, ['wheeler2002'], 'F-COOP'));
    out.push(...commonTmd(c));
    return out;
  },
  fixed_functional: (c) => {
    const { i, phase } = c;
    const out: R[] = [];
    if (phase === 'pubertaire') out.push(r('FF-PHASE', 2, 'Pic pubertaire : gain de longueur mandibulaire ~2 mm.', 'A', ['perinetti2015ffa']));
    else if (phase === 'post') out.push(r('FF-PHASE', -1, 'Croissance terminée : pas de gain squelettique démontré ; correction dentoalvéolaire possible.', 'A', ['perinetti2015ffa', 'cacciatore2014']));
    else if (phase === 'pre') out.push(r('FF-PHASE', -1, 'Prépubère : aucune donnée retrouvée (âge moyen des études : 13,5 ans).', 'A', ['zymperdikas2016']));
    if (i.dentition === 'temporaire' || i.dentition === 'mixte_precoce') out.push(r('FF-DENT', -1, 'Denture temporaire / mixte précoce : prérequis d\'ancrage non sourcés.', 'NS'));
    if (i.component === 'mandibulaire' || i.component === 'combinee') out.push(r('FF-COMP', 1, 'Composante mandibulaire : indication classique.', 'A', ['zymperdikas2016']));
    const coop = i.cooperation;
    if (coop === 'faible') out.push(r('FF-COOP', 1, 'Coopération faible : appareil non amovible ; abandon 12,9 % vs 33,6 % pour le Twin Block.', 'A', ['obrien2003herbst', 'pacha2024']));
    if (i.lowerIncisors === 'proclinees')
      out.push(r('G-INCINF', -2, 'Incisives inférieures déjà proclinées : proclinaison supplémentaire (avancée des incisives inférieures avec Herbst ; IMPA +5,8° avec MARA). Risque de récession : deux positions (Ruf 1998 vs Joss-Vassalli 2010).', 'A', ['pacha2024', 'ghislanzoni2011', 'ruf1998', 'joss2010']));
    if (i.hygiene === 'mediocre') out.push(r('G-HYG', -1, 'Hygiène médiocre : appareil fixe difficile à nettoyer (consensus).', 'NS'));
    out.push(...commonTmd(c));
    return out;
  },
  headgear: (c) => {
    const { i, phase } = c;
    const out: R[] = [];
    if (i.component === 'maxillaire') out.push(r('H-COMP', 2, 'Prognathie maxillaire : SNA −1,63°/an (preuve de haute qualité).', 'A', ['papageorgiou2017']));
    else if (i.component === 'combinee') out.push(r('H-COMP', 1, 'Composante combinée : la partie maxillaire est accessible au FEO.', 'A', ['papageorgiou2017']));
    else if (i.component === 'mandibulaire')
      out.push(r('H-COMP', 0, 'Composante mandibulaire : deux positions. Les essais Bionator/FEO attribuent le gain squelettique du FEO à la croissance mandibulaire (Keeling 1998) ; l\'action directe du FEO vise le maxillaire.', 'A', ['keeling1998', 'wheeler2002']));
    if (phase === 'pre' || phase === 'pubertaire') out.push(r('H-PHASE', 1, 'Enfant en croissance : population des essais.', 'A', ['papageorgiou2017']));
    else if (phase === 'post') out.push(r('H-PHASE', -2, 'Croissance terminée : effet orthopédique non attendu.', 'NS'));
    out.push(...commonCoop(c, { faible: -2, moyenne: -1, bonne: 1 }, ['wheeler2002'], 'H-COOP'));
    if (c.traumaFlag) out.push(r('H-TRAUMA', 1, 'Risque traumatique : moins de traumatismes incisifs avec le FEO précoce (RR 0,34).', 'A', ['papageorgiou2017', 'thiruvenkatachari2015']));
    return out;
  },
  rme: (c) => {
    const t = c.i.transverse;
    if (t === 'deficit')
      return [
        r('RME-TRANS', 2, 'Déficit transversal : indication du prétraitement ; la Classe II s\'accompagne souvent d\'une arcade maxillaire étroite relative.', 'A', ['baccetti1997', 'lione2013']),
        r('RME-SAG', 0, 'L\'effet sagittal sur la Classe II n\'est pas démontré (Feres 2015) ; une étude non randomisée rapporte un effet favorable (Guest 2010).', 'A', ['feres2015', 'guest2010']),
      ];
    if (t === 'normal') return [r('RME-TRANS', -2, 'Pas de déficit transversal : pas d\'indication ; effet sagittal non prouvé.', 'A', ['feres2015'])];
    return [];
  },
  aligner_ma: (c) => {
    const { i, phase } = c;
    const out: R[] = [r('AL-BASE', -1, 'Preuves limitées : 1 essai randomisé sur 9 études ; court terme.', 'A', ['huang2026', 'sohn2026'])];
    if (phase === 'pubertaire') out.push(r('AL-PHASE', 1, 'Pic pubertaire (CVM3) : effets squelettiques rapportés.', 'A', ['ravera2021']));
    else if (phase === 'pre') out.push(r('AL-PHASE', -1, 'Prépubère (CVM2) : effets dentoalvéolaires seulement.', 'A', ['ravera2021']));
    else if (phase === 'post') out.push(r('AL-PHASE', -1, 'Croissance terminée : aucune donnée retrouvée.', 'NS'));
    if (i.component === 'mandibulaire' || i.component === 'combinee') out.push(r('AL-COMP', 1, 'Composante mandibulaire : indication visée.', 'A', ['ravera2021']));
    else if (i.component === 'maxillaire') out.push(r('AL-COMP', -1, 'Composante maxillaire : aucune donnée retrouvée.', 'NS'));
    if (i.dentition === 'temporaire' || i.dentition === 'mixte_precoce') out.push(r('AL-DENT', -1, 'Dentition très précoce : lacunes de preuves signalées pour les aligneurs chez l\'enfant de 6–13 ans.', 'A', ['sipiyaruk2026']));
    out.push(...commonCoop(c, { faible: -2, moyenne: -1, bonne: 1 }, ['moreno2022'], 'AL-COOP'));
    out.push(...commonTmd(c));
    if (i.lowerIncisors === 'proclinees') out.push(r('G-INCINF', -1, 'Incisives inférieures déjà proclinées : proclinaison possible (non sourcé).', 'NS'));
    return out;
  },
  elastics: (c) => {
    const { i, phase } = c;
    const out: R[] = [];
    if (!c.mixed) out.push(r('E-DENT', 1, 'Denture permanente : condition d\'usage habituelle des élastiques intermaxillaires (consensus).', 'B', ['janson2013']));
    else out.push(r('E-DENT', -2, 'Denture mixte : hors des conditions des études retrouvées.', 'NS'));
    if (phase === 'post') out.push(r('E-PHASE', 1, 'Fin de croissance : le camouflage dentoalvéolaire devient la voie principale.', 'B', ['janson2013']));
    else if (phase === 'pre') out.push(r('E-PHASE', -2, 'Prépubère : hors fenêtre d\'usage ; effet dentoalvéolaire seulement.', 'NS'));
    if (i.component === 'dentaire') out.push(r('E-COMP', 1, 'Composante dentaire : l\'effet est dentoalvéolaire.', 'A', ['janson2013']));
    else if (i.component === 'mandibulaire') out.push(r('E-COMP', -1, 'Composante mandibulaire squelettique : l\'effet est dentoalvéolaire, pas squelettique.', 'A', ['janson2013']));
    if (i.cooperation === 'faible') out.push(r('E-COOP', -1, 'Coopération faible : élastiques à porter en continu.', 'NS'));
    if (i.lowerIncisors === 'proclinees') out.push(r('G-INCINF', -1, 'Incisives inférieures déjà proclinées : risque d\'aggraver la proclinaison (non sourcé).', 'NS'));
    return out;
  },
  distalization: (c) => {
    const { i, phase } = c;
    const out: R[] = [];
    if (!c.mixed) out.push(r('D-DENT', 1, 'Denture permanente : conditions des études de distalisation.', 'B', ['grec2013']));
    else out.push(r('D-DENT', -2, 'Denture mixte : hors des conditions des études retrouvées.', 'NS'));
    if (phase === 'post') out.push(r('D-PHASE', 1, 'Fin de croissance : camouflage maxillaire.', 'B', ['grec2013']));
    if (i.component === 'maxillaire' || i.component === 'dentaire') out.push(r('D-COMP', 1, 'Composante maxillaire ou dentaire : la distalisation agit sur ce maxillaire.', 'A', ['grec2013']));
    else if (i.component === 'mandibulaire') out.push(r('D-COMP', -1, 'Composante mandibulaire : la distalisation ne traite pas la mandibule.', 'NS'));
    out.push(r('D-ANCR', 0, 'Ancrage conventionnel : mésialisation des prémolaires (2,3 mm) ; ancrage squelettique : pas de perte d\'ancrage en ancrage direct.', 'A', ['grec2013', 'antonarakis2008']));
    return out;
  },
  observation: (c) => {
    const { phase } = c;
    const out: R[] = [];
    if (phase === 'pre') out.push(r('O-PHASE', 1, 'Prépubère : pas de meilleur résultat final avec un traitement précoce en 2 phases.', 'A', ['batista2018', 'tulloch2004']));
    else if (phase === 'pubertaire') out.push(r('O-PHASE', -1, 'Pic pubertaire : la fenêtre de croissance la plus favorable est en cours.', 'A', ['baccetti2000', 'perinetti2015rfa']));
    else if (phase === 'post') out.push(r('O-PHASE', -1, 'Croissance terminée : la Classe II ne se corrigera pas spontanément ; décider du camouflage ou de la chirurgie.', 'A', ['baccetti1997']));
    if (c.i.dentition === 'temporaire' || c.i.dentition === 'mixte_precoce') out.push(r('O-DENT', 1, 'Denture précoce : attendre ne ferme pas l\'accès à un traitement ultérieur à résultat équivalent.', 'A', ['batista2018', 'obrien2009']));
    if (c.traumaFlag) out.push(r('O-TRAUMA', -2, 'Risque ou antécédent de traumatisme : le traitement précoce réduit l\'incidence des traumatismes (19 % vs 30 %).', 'A', ['batista2018', 'thiruvenkatachari2015', 'petti2015']));
    else if (c.i.traumaHistory === 'non' && isNum(c.i.overjet)) out.push(r('O-TRAUMA', 1, 'Pas d\'antécédent de traumatisme ni d\'overjet très augmenté : l\'avantage du traitement précoce ne s\'applique pas.', 'A', ['batista2018']));
    return out;
  },
};

const STATUS_RANK: Record<Status, number> = { piste: 0, reserves: 1, non_evaluable: 2, peu_adapte: 3, deconseille: 4 };

function statusOf(reasons: R[], id: ApplianceId, input: CaseInput): Status {
  const neg2 = reasons.filter((x) => x.weight === -2).length;
  const sum = reasons.reduce((a, x) => a + x.weight, 0);
  let s: Status;
  if (neg2 >= 2) s = 'deconseille';
  else if (neg2 === 1) s = 'peu_adapte';
  else if (sum >= 2) s = 'piste';
  else s = 'reserves';
  const capped = EVIDENCE_CAP.includes(id) || (input.division === 'div2' && id !== 'observation' && id !== 'rme');
  if (capped && s === 'piste') s = 'reserves';
  if (s === 'piste' && !hasIndication(id, input)) s = 'reserves';
  return s;
}

// Une option n'est une piste que si la composante saisie correspond à ce sur quoi elle agit.
function hasIndication(id: ApplianceId, input: CaseInput): boolean {
  const c = input.component;
  if (['activator', 'twinblock', 'frankel', 'fixed_functional', 'aligner_ma'].includes(id)) return c === 'mandibulaire' || c === 'combinee';
  if (id === 'headgear') return c === 'maxillaire' || c === 'combinee';
  return true;
}

function verdictFor(id: ApplianceId, ctx: Ctx): Verdict {
  const needs: string[] = [];
  if (TIMING_DEPENDENT.includes(id) && ctx.phase === 'inconnue') needs.push('Stade de maturation (CVM CS1–CS6) : le moment de croissance conditionne l\'effet attendu.');
  if (ADVANCEMENT.includes(id) && ctx.tmdUnknown) needs.push('Examen de l\'ATM : à réaliser avant tout appareil de position mandibulaire.');
  if (id === 'rme' && (ctx.i.transverse === undefined || ctx.i.transverse === 'non_evalue')) needs.push('Évaluation transversale (endognathie maxillaire, croisement).');
  const reasons = RULES[id](ctx);
  if (ctx.i.division === 'div2' && id !== 'observation' && id !== 'rme')
    reasons.push(r('G-DIV2', 0, 'Classe II division 2 : les essais retrouvés portent surtout sur la division 1 ; avis spécialisé et prudence.', 'B', ['batista2018']));
  if (EVIDENCE_CAP.includes(id)) reasons.push(r('G-CAP', 0, 'Niveau de preuve limité : le guide ne place pas cette option en « piste logique ».', 'B'));
  const wouldBePiste = reasons.every((x) => x.weight > -2) && reasons.reduce((a, x) => a + x.weight, 0) >= 2;
  if (wouldBePiste && !hasIndication(id, ctx.i))
    reasons.push(r('G-INDIC', 0, 'La composante saisie ne correspond pas à la cible principale de cet appareil : il n\'est pas proposé comme piste logique.', 'B'));
  const status: Status = needs.length > 0 ? 'non_evaluable' : statusOf(reasons, id, ctx.i);
  return { applianceId: id, status, reasons, needs };
}

function buildFindings(ctx: Ctx, optional: MissingItem[]): Finding[] {
  const { i, phase } = ctx;
  const f: Finding[] = [];
  const add = (x: Finding) => f.push(x);

  if (phase === 'pre')
    add({ id: 'I-PHASE', kind: 'information', title: 'Phase prépubertaire (CS1–CS2)', level: 'A', sources: ['perinetti2015rfa', 'batista2018', 'mcnamara2018'], text: 'Gain mandibulaire supplémentaire moyen des appareils amovibles ~0,95 mm (GRADE faible) contre ~2,91 mm au pic pubertaire. Un traitement précoce en 2 phases n\'améliore pas le résultat final vs un traitement unique à l\'adolescence (sauf traumatismes).' });
  else if (phase === 'pubertaire')
    add({ id: 'I-PHASE', kind: 'information', title: 'Phase circumpubertaire (CS3–CS4)', level: 'A', sources: ['perinetti2015rfa', 'baccetti2000', 'franchi2000', 'mcnamara2018'], text: 'Fenêtre où les appareils fonctionnels donnent le plus d\'effet squelettique : gain mandibulaire ~2,91 mm (amovibles), plus grand incrément de longueur mandibulaire entre CS3 et CS4. Un seul cliché ne dit pas où l\'on se situe dans cette phase.' });
  else if (phase === 'post')
    add({ id: 'I-PHASE', kind: 'garde-fou', title: 'Croissance terminée (CS5–CS6) : hors du périmètre « interception »', level: 'A', sources: ['perinetti2015ffa', 'mcnamara2018'], text: 'Les effets squelettiques des appareils fonctionnels ne sont pas démontrés après la phase pubertaire. Les options deviennent dentoalvéolaires (camouflage) ; la chirurgie orthognathique est une orientation à discuter avec un spécialiste (aucune source retrouvée pour la décision chirurgicale).' });
  else
    add({ id: 'D-CVM', kind: 'abstention', title: 'Maturation squelettique non évaluée', level: 'B', sources: ['mcnamara2018'], text: 'Sans stade de maturation, le guide ne se prononce pas sur le choix des appareils dépendant de la croissance. À renseigner : stade CVM sur la téléradiographie de profil ; alternatives : radio main-poignet.' });

  if (phase !== 'inconnue')
    add({ id: 'I-CVM-LIM', kind: 'information', title: 'Limites de la méthode CVM', level: 'A', sources: ['gabriel2009', 'nestman2011', 'perinetti2014cvm', 'szemraj2018', 'cericato2015'], text: 'Position défavorable : concordance inter-observateurs < 50 %, intra-observateur 62 % ; les auteurs ne recommandent pas la CVM comme guide strict du timing. Position favorable : visuelle, environ 68 % de concordance avec la référence, erreurs le plus souvent d\'un seul stade ; forte corrélation avec la radio main-poignet. Les stades 4 et 5 sont les plus mal classés.' });

  if (i.component)
    add({ id: 'I-COMP', kind: 'information', title: 'La « composante » dépend de l\'indicateur choisi', level: 'A', sources: ['rosenblum1995', 'baccetti1997', 'hussels1984'], text: 'Dans la littérature, la proportion de rétrusion mandibulaire ou de protrusion maxillaire varie fortement selon l\'indicateur utilisé (27 % de rétrusion avec l\'angle de Downs ; 56 % de protrusion avec NA-FH). L\'ANB est influencé par la rotation et la hauteur faciale. La composante saisie est donc un jugement du praticien, pas une sortie automatique.' });

  if (isNum(i.overjet) && i.overjet > 0) {
    add({ id: 'I-TRAUMA', kind: 'information', title: 'Risque traumatique', level: 'A', sources: ['petti2015', 'batista2018', 'thiruvenkatachari2015'], text: `Un overjet augmenté double environ le risque de traumatisme des incisives (OR 2,0–2,3 selon les catégories étudiées : seuil 3–4 mm ou 6 ± 1 mm). Le traitement précoce réduit l'incidence de nouveaux traumatismes (19 % vs 30 %, preuve modérée ; NNT 10 avec un fonctionnel, IC 95 % 5–174). Overjet saisi : ${i.overjet} mm.` });
  }

  if (i.tmd === 'douleur_limitation')
    add({ id: 'G-ATM', kind: 'garde-fou', title: 'ATM symptomatique', level: 'B', sources: ['kim2002', 'michelotti2010', 'minervini2024'], text: 'Douleur ou limitation : bilan et prise en charge avant tout appareil de position mandibulaire (consensus). Les revues n\'indiquent pas que l\'orthodontie ou le Herbst augmentent la prévalence des DTM, mais l\'hétérogénéité est forte et les études de Herbst sont peu nombreuses (4).' });

  if (i.transverse === 'deficit')
    add({ id: 'P-TRANS', kind: 'pretraitement', title: 'Déficit transversal : prétraitement à envisager', level: 'B', sources: ['baccetti1997', 'lione2013', 'feres2015', 'guest2010'], text: 'La Classe II s\'accompagne souvent d\'une arcade maxillaire étroite. La disjonction traite la dimension transversale ; son effet sagittal n\'est pas démontré (revue : aucun essai randomisé) alors qu\'une étude prospective non randomisée rapporte un bénéfice.' });

  if (i.lowerIncisors === 'proclinees')
    add({ id: 'G-INCINF', kind: 'garde-fou', title: 'Incisives inférieures déjà proclinées', level: 'A', sources: ['pacha2024', 'ghislanzoni2011', 'ruf1998', 'joss2010'], text: 'Les appareils qui avancent la mandibule proclinent les incisives inférieures (Herbst, MARA, trainer). Risque de récession : deux positions. Herbst : 97 % des incisives sans récession (98 enfants). Revue systématique : plus de récession sur les dents proclinées, résultats contradictoires, pas d\'étude de haute qualité.' });

  if (i.airway === 'obstruction')
    add({ id: 'P-VOIES', kind: 'pretraitement', title: 'Obstruction des voies aériennes suspectée', level: 'NS', sources: [], text: 'Avis ORL avant un appareil buccal. Aucune source retrouvée dans cette phase de recherche pour fixer la conduite : consensus à valider.' });

  if (i.hygiene === 'mediocre')
    add({ id: 'G-HYG', kind: 'garde-fou', title: 'Hygiène médiocre', level: 'NS', sources: [], text: 'Amélioration de l\'hygiène et prise en charge carieuse avant un appareil fixe ou collé. Consensus clinique non sourcé dans cette phase.' });

  if (i.division === 'div2')
    add({ id: 'G-DIV2', kind: 'garde-fou', title: 'Classe II division 2', level: 'B', sources: ['batista2018'], text: 'Les essais retrouvés portent sur la division 1 (« prominent upper front teeth »). Le guide plafonne ses pistes à « avec réserves » et recommande un avis spécialisé.' });

  if (!isNum(i.wits))
    add({ id: 'I-WITS', kind: 'information', title: 'Wits non renseigné', level: 'A', sources: ['hussels1984', 'jacobson1975'], text: 'L\'ANB seul peut tromper : il varie avec la rotation des maxillaires et la hauteur faciale même quand le Wits est nul. Renseigner le Wits aide à trancher.' });

  if (isNum(i.age))
    add({ id: 'I-NORMES', kind: 'information', title: 'Normes de référence et population tunisienne', level: 'A', sources: ['benamor2003', 'mcnamara1984'], text: 'Aucune norme céphalométrique tunisienne exploitable n\'a été retrouvée ; la seule source tunisienne (53 étudiants) montre que plusieurs valeurs diffèrent des moyennes classiques. Les valeurs de référence habituelles sont issues d\'autres populations : à interpréter avec prudence.' });

  const optMissing = optional.filter((o) => ['tmd', 'cooperation', 'transverse', 'lowerIncisors'].includes(o.field));
  if (optMissing.length > 0)
    add({ id: 'D-OPT', kind: 'abstention', title: 'Données recommandées manquantes', level: 'B', sources: [], text: `Non renseigné ou non évalué : ${optMissing.map((o) => o.label).join(', ')}. Les règles correspondantes ne sont pas évaluées plutôt qu'estimées.` });

  return f;
}

const REEVAL: Claim[] = [
  { text: 'Réévaluer l\'overjet, la relation molaire et la relation squelettique (ANB et Wits) à intervalles réguliers ; rythme et seuils d\'échec non sourcés : à fixer par le clinicien.', level: 'C', sources: [] },
  { text: 'Exemple de critère d\'échec utilisé dans un essai : overjet non ramené sous 4 mm à 12 mois de traitement (Pacha 2024).', level: 'A', sources: ['pacha2024'] },
  { text: 'Mesurer le port réel des appareils amovibles par capteur de température lorsque c\'est possible : le temps de port objectif est en général inférieur au temps prescrit.', level: 'A', sources: ['moreno2022'] },
  { text: 'Contrôler l\'inclinaison des incisives inférieures (IMPA) pendant le traitement ; la récidive de l\'IMPA après dépose a été observée avec le MARA.', level: 'A', sources: ['ghislanzoni2011'] },
  { text: 'Si la maturation évolue (passage CS2 → CS3), reposer la question du moment : le guide doit être relancé avec le nouveau stade.', level: 'A', sources: ['baccetti2000', 'franchi2000'] },
];

const PLAN_B: Claim[] = [
  { text: 'Échec ou abandon d\'un appareil amovible par défaut de coopération : un appareil non amovible a un taux d\'abandon plus faible dans l\'essai randomisé Herbst vs Twin Block (12,9 % vs 33,6 %).', level: 'A', sources: ['obrien2003herbst', 'pacha2024'] },
  { text: 'Fenêtre de croissance manquée ou croissance terminée : bascule vers le camouflage dentoalvéolaire (élastiques, distalisation) ou orientation chirurgicale à discuter avec un spécialiste ; aucune source retrouvée pour fixer les critères chirurgicaux.', level: 'NS', sources: [] },
  { text: 'Apparition de douleurs ou de limitation de l\'ATM en cours de traitement : suspendre l\'avancée et réévaluer (consensus).', level: 'B', sources: ['michelotti2010'] },
  { text: 'Après un traitement précoce, la récidive dentaire à l\'arrêt est documentée : prévoir contention ou phase suivante.', level: 'A', sources: ['keeling1998', 'bock2016'] },
];

export function analyze(input: CaseInput): Result {
  const { required, optional } = missingOf(input);
  const doubts = checkConsistency(input);
  const phase = growthPhase(input.cvm);

  if (isNum(input.age) && input.age >= 18) {
    return {
      mode: 'hors_perimetre',
      missing: [],
      doubts,
      phase,
      findings: [
        {
          id: 'D-ADULTE',
          kind: 'abstention',
          title: 'Patient adulte : hors du périmètre de ce guide',
          level: 'B',
          sources: [],
          text: 'Le guide cible l\'interception en croissance. Chez l\'adulte les options relèvent du camouflage dentoalvéolaire ou de la chirurgie orthognathique ; aucune source n\'a été retrouvée dans cette phase pour fixer cette décision.',
        },
      ],
      verdicts: [],
      reevaluation: [],
      planB: [],
    };
  }

  if (required.length > 0) {
    return {
      mode: 'abstention',
      missing: [...required, ...optional],
      doubts,
      phase,
      findings: [
        {
          id: 'D-REQ',
          kind: 'abstention',
          title: 'Le guide s\'abstient : données obligatoires manquantes',
          level: 'B',
          sources: [],
          text: `Pour ne jamais deviner, aucune orientation n'est produite tant que les données suivantes manquent : ${required.map((m) => m.label).join(' ; ')}.`,
        },
      ],
      verdicts: [],
      reevaluation: [],
      planB: [],
    };
  }

  const ctx: Ctx = {
    i: input,
    phase,
    mixed: !!input.dentition && MIXED.includes(input.dentition),
    traumaFlag: input.traumaHistory === 'oui' || (isNum(input.overjet) && input.overjet > 6),
    tmdUnknown: input.tmd === undefined || input.tmd === 'non_evalue',
  };

  const ids = Object.keys(RULES) as ApplianceId[];
  const verdicts = ids
    .map((id) => verdictFor(id, ctx))
    .sort((a, b) => {
      const d = STATUS_RANK[a.status] - STATUS_RANK[b.status];
      if (d !== 0) return d;
      return b.reasons.reduce((s, x) => s + x.weight, 0) - a.reasons.reduce((s, x) => s + x.weight, 0);
    });

  return {
    mode: phase === 'inconnue' ? 'partielle' : 'analyse',
    missing: optional,
    doubts,
    phase,
    findings: buildFindings(ctx, optional),
    verdicts,
    reevaluation: REEVAL,
    planB: PLAN_B,
  };
}
