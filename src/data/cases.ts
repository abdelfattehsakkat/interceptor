import type { CaseInput, Result } from '../types';
import type { ApplianceId } from './appliances';
import type { Status } from '../types';

export interface ReferenceCase {
  id: string;
  title: string;
  tag: 'typique' | 'limite' | 'contradictoire' | 'abstention';
  input: CaseInput;
  expectMode: Result['mode'];
  expect: Partial<Record<ApplianceId, Status>>;
  /** Ce que le cas doit montrer, rédigé pour la relecture par un clinicien. */
  reasoning: string;
  expectDoubt?: string;
}

const base: CaseInput = {
  sex: undefined,
  division: 'div1',
  molar: 'demi',
  vertical: 'normo',
  transverse: 'normal',
  lowerIncisors: 'normales',
  tmd: 'aucun',
  airway: 'libre',
  hygiene: 'bonne',
  cooperation: 'bonne',
  traumaHistory: 'non',
};

export const CASES: ReferenceCase[] = [
  {
    id: 'C01',
    title: 'Classe II à dominante dentaire, enfant prépubère coopérant',
    tag: 'typique',
    input: { ...base, age: 9, dentition: 'mixte_precoce', cvm: 'CS1', overjet: 5, overbite: 4, sna: 82, snb: 79, anb: 3, wits: 2, component: 'dentaire', habits: ['posture_linguale'] },
    expectMode: 'analyse',
    expect: { trainer: 'piste', observation: 'piste', headgear: 'reserves' },
    reasoning:
      'Cas où l\'éducateur fonctionnel est logique : composante dentoalvéolaire, denture mixte, enfant coopérant avec dysfonction linguale. L\'observation reste défendable car l\'overjet est modéré et il n\'y a pas d\'antécédent de traumatisme (Cochrane 2018).',
  },
  {
    id: 'C02',
    title: 'Rétrognathie mandibulaire au pic pubertaire, bonne coopération',
    tag: 'typique',
    input: { ...base, age: 12, dentition: 'mixte_tardive', cvm: 'CS3', overjet: 7, overbite: 4, sna: 82, snb: 75, anb: 7, wits: 5, component: 'mandibulaire' },
    expectMode: 'analyse',
    expect: { activator: 'piste', twinblock: 'piste', fixed_functional: 'piste', trainer: 'reserves', observation: 'peu_adapte' },
    reasoning:
      'Fenêtre pubertaire + composante mandibulaire : les appareils sur mesure sont la piste (Perinetti 2015, Baccetti 2000). Le trainer reste possible mais moins pertinent (Idris 2019, Papageorgiou 2019). Attendre n\'est plus logique : la fenêtre est ouverte.',
  },
  {
    id: 'C03',
    title: 'Prognathie maxillaire chez l\'enfant, bonne coopération',
    tag: 'typique',
    input: { ...base, age: 10, dentition: 'mixte_tardive', cvm: 'CS2', overjet: 8, overbite: 3, sna: 86, snb: 79, anb: 7, wits: 4, component: 'maxillaire' },
    expectMode: 'analyse',
    expect: { headgear: 'piste', activator: 'reserves' },
    reasoning:
      'Composante maxillaire : le FEO est l\'option avec preuve de haute qualité sur le SNA (Papageorgiou 2017). Les fonctionnels agissent peu sur le maxillaire (Koretsi 2015). L\'overjet > 6 mm déclenche aussi le signal traumatique.',
  },
  {
    id: 'C04',
    title: 'Pic pubertaire, mandibulaire, coopération faible',
    tag: 'limite',
    input: { ...base, age: 13, dentition: 'permanente_jeune', cvm: 'CS3', overjet: 8, overbite: 5, sna: 81, snb: 74, anb: 7, component: 'mandibulaire', cooperation: 'faible' },
    expectMode: 'analyse',
    expect: { fixed_functional: 'piste', twinblock: 'peu_adapte', activator: 'peu_adapte', trainer: 'peu_adapte' },
    reasoning:
      'La coopération prime : un appareil non amovible est plus logique (abandon 12,9 % vs 33,6 %, O\'Brien 2003). Les amovibles sont déconseillés dans ce profil.',
  },
  {
    id: 'C05',
    title: 'ATM douloureuse avec limitation d\'ouverture',
    tag: 'limite',
    input: { ...base, age: 12, dentition: 'mixte_tardive', cvm: 'CS3', overjet: 7, overbite: 4, sna: 82, snb: 75, anb: 7, component: 'mandibulaire', tmd: 'douleur_limitation' },
    expectMode: 'analyse',
    expect: { activator: 'peu_adapte', twinblock: 'peu_adapte', fixed_functional: 'peu_adapte' },
    reasoning:
      'Garde-fou : aucun appareil d\'avancée n\'est proposé comme piste tant que l\'ATM est symptomatique (consensus de niveau B) : ils sont classés « peu adaptés » jusqu\'à bilan. Les revues n\'indiquent pas que l\'orthodontie augmente les DTM, mais la prudence prime (Kim 2002, Michelotti 2010).',
  },
  {
    id: 'C06',
    title: 'Incisives inférieures déjà proclinées avant l\'avancée',
    tag: 'limite',
    input: { ...base, age: 13, dentition: 'permanente_jeune', cvm: 'CS3', overjet: 7, overbite: 3, sna: 82, snb: 75, anb: 7, impa: 105, component: 'mandibulaire', lowerIncisors: 'proclinees', cooperation: 'moyenne' },
    expectMode: 'analyse',
    expect: { fixed_functional: 'peu_adapte', trainer: 'peu_adapte' },
    reasoning:
      'Les appareils fixes proclinent davantage les incisives inférieures (Pacha 2024, Ghislanzoni 2011). Le risque de récession est débattu (Ruf 1998 vs Joss-Vassalli 2010) : le cas est signalé et documenté avec les deux positions.',
  },
  {
    id: 'C07',
    title: 'Fin de croissance, camouflage dentaire',
    tag: 'typique',
    input: { ...base, age: 16, dentition: 'permanente', cvm: 'CS5', overjet: 6, overbite: 4, sna: 83, snb: 79, anb: 4, wits: 3, component: 'dentaire' },
    expectMode: 'analyse',
    expect: { elastics: 'piste', distalization: 'piste', activator: 'peu_adapte', twinblock: 'peu_adapte', headgear: 'peu_adapte' },
    reasoning:
      'Hors fenêtre de croissance : les appareils fonctionnels n\'ont pas de gain squelettique démontré ; la voie est dentoalvéolaire (Janson 2013, Grec 2013).',
  },
  {
    id: 'C08',
    title: 'Déficit transversal associé, enfant prépubère',
    tag: 'typique',
    input: { ...base, age: 9, dentition: 'mixte_precoce', cvm: 'CS1', overjet: 6, overbite: 3, sna: 82, snb: 77, anb: 5, component: 'combinee', transverse: 'deficit' },
    expectMode: 'analyse',
    expect: { rme: 'piste' },
    reasoning:
      'Prétraitement transversal. L\'effet sagittal de la disjonction n\'est pas prouvé (Feres 2015) mais une étude le rapporte (Guest 2010) : les deux positions s\'affichent.',
  },
  {
    id: 'C09',
    title: 'Dossier incomplet : ANB, CVM et composante manquants',
    tag: 'abstention',
    input: { ...base, age: 11, dentition: 'mixte_tardive', overjet: 6, sna: 82, snb: 77 },
    expectMode: 'abstention',
    expect: {},
    reasoning: 'Le guide doit s\'abstenir, lister les données obligatoires manquantes et ne produire aucune orientation.',
  },
  {
    id: 'C10',
    title: 'Maturation non évaluée',
    tag: 'abstention',
    input: { ...base, age: 11, dentition: 'mixte_tardive', cvm: 'non_evalue', overjet: 6, overbite: 3, sna: 82, snb: 76, anb: 6, component: 'mandibulaire' },
    expectMode: 'partielle',
    expect: { activator: 'non_evaluable', twinblock: 'non_evaluable', fixed_functional: 'non_evaluable', headgear: 'non_evaluable' },
    reasoning:
      'Abstention partielle : les appareils dépendants du timing ne sont pas évalués ; les garde-fous restent affichés avec la liste de ce qu\'il faut renseigner (stade CVM).',
  },
  {
    id: 'C11',
    title: 'Mesures incohérentes : SNA − SNB ≠ ANB',
    tag: 'contradictoire',
    input: { ...base, age: 11, dentition: 'mixte_tardive', cvm: 'CS3', overjet: 6, overbite: 3, sna: 82, snb: 77, anb: 9, component: 'mandibulaire' },
    expectMode: 'analyse',
    expect: {},
    expectDoubt: 'SNA − SNB ≠ ANB',
    reasoning:
      'Le guide signale l\'incohérence arithmétique et demande de vérifier la saisie ; l\'analyse reste possible mais marquée « donnée douteuse ».',
  },
  {
    id: 'C12',
    title: 'Classe II division 2 au pic pubertaire',
    tag: 'limite',
    input: { ...base, age: 12, dentition: 'mixte_tardive', cvm: 'CS3', division: 'div2', overjet: 3, overbite: 6, sna: 82, snb: 76, anb: 6, component: 'mandibulaire' },
    expectMode: 'analyse',
    expect: { activator: 'reserves', twinblock: 'reserves', fixed_functional: 'reserves' },
    reasoning: 'Les essais portent surtout sur la division 1 : aucune option n\'est en « piste logique » ; avis spécialisé.',
  },
  {
    id: 'C13',
    title: 'Overjet très augmenté avec antécédent de traumatisme, prépubère',
    tag: 'limite',
    input: { ...base, age: 9, dentition: 'mixte_precoce', cvm: 'CS1', overjet: 9, overbite: 3, sna: 84, snb: 78, anb: 6, component: 'combinee', traumaHistory: 'oui' },
    expectMode: 'analyse',
    expect: { observation: 'peu_adapte', headgear: 'piste' },
    reasoning:
      'Cas où le traitement précoce se justifie malgré l\'absence de meilleur résultat final : le traitement précoce réduit les traumatismes (Cochrane 2018 ; Thiruvenkatachari 2015). C\'est le seul bénéfice démontré.',
  },
  {
    id: 'C14',
    title: 'ATM non examinée au pic pubertaire',
    tag: 'abstention',
    input: { ...base, age: 12, dentition: 'mixte_tardive', cvm: 'CS4', overjet: 7, overbite: 4, sna: 82, snb: 75, anb: 7, component: 'mandibulaire', tmd: 'non_evalue' },
    expectMode: 'analyse',
    expect: { activator: 'non_evaluable', twinblock: 'non_evaluable', fixed_functional: 'non_evaluable', aligner_ma: 'non_evaluable', headgear: 'reserves' },
    reasoning:
      'Le guide n\'estime pas l\'état de l\'ATM : les appareils de position mandibulaire sont « non évaluables » tant que l\'examen n\'est pas fait.',
  },
  {
    id: 'C15',
    title: 'Enfant hyperdivergent, dominante dentaire, coopération moyenne',
    tag: 'limite',
    input: { ...base, age: 9, dentition: 'mixte_precoce', cvm: 'CS2', overjet: 6, overbite: 1, sna: 82, snb: 78, anb: 4, snGoGn: 40, component: 'dentaire', vertical: 'hyper', cooperation: 'moyenne' },
    expectMode: 'analyse',
    expect: { trainer: 'reserves' },
    reasoning:
      'Le trainer est ici « possible avec réserves » : l\'hyperdivergence et la coopération moyenne pèsent (hausse de la hauteur faciale vs témoins, Usumez 2004). Le seuil chiffré de divergence n\'est pas posé par le guide.',
  },
  {
    id: 'C16',
    title: 'Adulte demandant une correction de Classe II',
    tag: 'abstention',
    input: { ...base, age: 25, dentition: 'permanente', cvm: 'CS6', overjet: 7, overbite: 4, sna: 83, snb: 77, anb: 6, component: 'mandibulaire' },
    expectMode: 'hors_perimetre',
    expect: {},
    reasoning: 'Hors périmètre : le guide s\'abstient et oriente vers un avis spécialisé (aucune source retrouvée pour la décision chirurgicale).',
  },
  {
    id: 'C17',
    title: 'Demande esthétique d\'aligneurs à avancée au pic pubertaire',
    tag: 'contradictoire',
    input: { ...base, age: 13, dentition: 'permanente_jeune', cvm: 'CS3', overjet: 6, overbite: 3, sna: 82, snb: 76, anb: 6, component: 'mandibulaire' },
    expectMode: 'analyse',
    expect: { aligner_ma: 'reserves', activator: 'piste' },
    reasoning:
      'Les aligneurs à avancée sont plafonnés à « possible avec réserves » (1 essai randomisé sur 9 études) alors que les appareils classiques sont en piste : le guide le dit sans cacher la demande esthétique.',
  },
  {
    id: 'C18',
    title: 'Âge et stade CVM peu compatibles',
    tag: 'contradictoire',
    input: { ...base, age: 8, dentition: 'mixte_precoce', cvm: 'CS5', overjet: 6, overbite: 3, sna: 82, snb: 77, anb: 5, component: 'mandibulaire' },
    expectMode: 'analyse',
    expect: {},
    expectDoubt: 'Âge et stade CVM peu compatibles',
    reasoning:
      'Une maturation CS5 à 8 ans est peu plausible : le guide signale le doute et rappelle les limites de reproductibilité de la CVM (Gabriel 2009, Nestman 2011 vs Perinetti 2014).',
  },
];
