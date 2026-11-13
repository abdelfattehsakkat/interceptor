import type { Claim } from '../types';

export type ApplianceId =
  | 'trainer'
  | 'activator'
  | 'twinblock'
  | 'frankel'
  | 'fixed_functional'
  | 'headgear'
  | 'rme'
  | 'aligner_ma'
  | 'elastics'
  | 'distalization'
  | 'observation';

export interface Appliance {
  id: ApplianceId;
  name: string;
  family: string;
  alsoKnownAs?: string;
  focus?: boolean;
  summary: string;
  principle: Claim[];
  mostLogical: Claim[];
  discouraged: Claim[];
  doesNot: Claim[];
  effects: Claim[];
  duration: Claim[];
  cooperation: Claim[];
  adverse: Claim[];
  evidenceGrade: string;
  evidenceText: string;
  uncertainties: string[];
}

export const APPLIANCES: Appliance[] = [
  {
    id: 'trainer',
    name: 'Éducateur fonctionnel (appareil myofonctionnel préfabriqué)',
    family: 'Fonctionnel amovible — préfabriqué',
    alsoKnownAs: 'Trainer, T4K, Myobrace et appareils similaires (l\'étiquette commerciale varie ; les essais cités utilisent le Trainer for Kids T4K et le preorthodontic trainer de Myofunctional Research Co.)',
    focus: true,
    summary:
      'Appareil non individualisé porté en journée et pendant le sommeil. Les essais montrent une réduction de l\'overjet à effet surtout dentoalvéolaire, inférieure à celle des appareils fonctionnels sur mesure. Son atout documenté est son faible coût.',
    principle: [
      {
        text: 'Appareil préfabriqué à visée myofonctionnelle : il est promu pour agir sur les fonctions orales (posture, déglutition, respiration) en plus de la position dentaire.',
        level: 'B',
        sources: ['idris2019', 'amat2023'],
        note: 'Idris 2019 relève que l\'attention portée au rôle des fonctions orales dans l\'étiologie de la Classe II a favorisé la diffusion de ces appareils « dont l\'efficacité reste à démontrer ».',
      },
      {
        text: 'Protocole des études : port 1 h/jour + pendant le sommeil (Usumez) ; 12 mois de traitement (Idris). Ce sont des protocoles d\'étude, pas des consignes.',
        level: 'A',
        sources: ['usumez2004', 'idris2019'],
      },
    ],
    mostLogical: [
      {
        text: 'Classe II division 1 à dominante dentoalvéolaire, en denture mixte (8–12 ans dans les essais), quand l\'objectif principal est de réduire l\'overjet.',
        level: 'A',
        sources: ['usumez2004', 'papageorgiou2019'],
        note: 'Vs absence de traitement : overjet −2,4 mm (IC 95 % −3,3 à −1,5), mais issu d\'un seul essai.',
      },
      {
        text: 'Option à coût réduit lorsque l\'accès à un appareil sur mesure est limité : l\'avantage principal des appareils préfabriqués est le coût.',
        level: 'A',
        sources: ['mohammed2020', 'papageorgiou2019'],
      },
      {
        text: 'Enfant coopérant présentant une dysfonction orale associée (posture linguale, respiration buccale, déglutition atypique).',
        level: 'B',
        sources: ['idris2019'],
        note: 'L\'efficacité du trainer sur la correction durable de ces dysfonctions n\'a pas été établie dans les sources lues pour la Classe II.',
      },
    ],
    discouraged: [
      {
        text: 'Composante mandibulaire marquée chez un patient au pic pubertaire (CS3–CS4) : un appareil sur mesure donne de meilleurs résultats squelettiques.',
        level: 'A',
        sources: ['papageorgiou2019', 'idris2019', 'baccetti2000'],
      },
      {
        text: 'Incisives inférieures déjà proclinées : une proclinaison inférieure supplémentaire significative par rapport aux témoins est rapportée.',
        level: 'A',
        sources: ['usumez2004'],
        note: 'Une seule étude contrôlée de 20 patients par groupe.',
      },
      {
        text: 'Hyperdivergence : augmentation significative de la hauteur faciale totale vs témoins rapportée.',
        level: 'A',
        sources: ['usumez2004'],
        note: 'Même étude ; à confirmer.',
      },
      {
        text: 'Coopération faible ou non fiable : le port quotidien et nocturne est nécessaire ; l\'expérience patient et la compliance sont rapportées comme moins favorables qu\'avec les activateurs.',
        level: 'A',
        sources: ['mohammed2020', 'idris2012'],
      },
      {
        text: 'Obstruction nasale importante (portage difficile) : avis ORL avant toute décision.',
        level: 'NS',
        sources: [],
        note: 'Raisonnement clinique non étayé par une source retrouvée. À valider par l\'orthodontiste.',
      },
    ],
    doesNot: [
      {
        text: 'N\'atteint pas l\'effet squelettique des appareils sur mesure : en 12 mois, ANB −0,9° vs −1,89° avec l\'activateur ; overjet −1,5 mm vs −3,0 mm.',
        level: 'A',
        sources: ['idris2019'],
      },
      {
        text: 'Vs appareils sur mesure (3 essais) : ANB +0,9°, branche montante −2,2 mm, overjet +1,5 mm, moins de Classe I molaire obtenue.',
        level: 'A',
        sources: ['papageorgiou2019'],
      },
      {
        text: 'Ne démontre pas de croissance mandibulaire supplémentaire cliniquement significative : dans l\'étude contrôlée, seuls la hauteur faciale totale, la proclinaison des incisives inférieures et l\'overjet diffèrent des témoins.',
        level: 'A',
        sources: ['usumez2004'],
      },
      {
        text: 'Aucune preuve de stabilité à long terme retrouvée ; pas de différence avec les activateurs à long terme dans la revue systématique, mais preuves de faible qualité.',
        level: 'A',
        sources: ['mohammed2020'],
      },
    ],
    effects: [
      {
        text: 'Réduction d\'overjet et d\'overbite, moins d\'encombrement mandibulaire et plus de Classe I canine vs aucun traitement (un essai).',
        level: 'A',
        sources: ['papageorgiou2019'],
      },
      {
        text: 'Effets dentoalvéolaires : réduction de l\'overjet, proclinaison des incisives inférieures, rétroclinaison des incisives supérieures (non significative vs témoins).',
        level: 'A',
        sources: ['usumez2004'],
      },
    ],
    duration: [
      { text: 'Durée de 12 mois dans l\'essai randomisé ; ~13 mois dans l\'étude contrôlée. Aucune source retrouvée pour fixer une durée recommandée.', level: 'A', sources: ['idris2019', 'usumez2004'] },
    ],
    cooperation: [
      {
        text: 'Coopération élevée requise (port diurne + nocturne dans les protocoles étudiés). La revue sur les capteurs de température indique que le temps de port mesuré est en général inférieur à celui prescrit, tous appareils amovibles confondus.',
        level: 'A',
        sources: ['usumez2004', 'moreno2022'],
      },
    ],
    adverse: [
      {
        text: 'Pression, sensibilité dentaire, gêne orale et trouble de l\'élocution plus marqués qu\'avec l\'activateur, avec diminution dans le temps.',
        level: 'A',
        sources: ['idris2012'],
      },
      { text: 'Proclinaison des incisives inférieures.', level: 'A', sources: ['usumez2004'] },
    ],
    evidenceGrade: 'Faible à modérée',
    evidenceText:
      'Peu d\'essais, courts (≈12 mois), souvent sans aveugle ; un seul essai contre aucun traitement ; qualité jugée modérée à faible par les revues systématiques.',
    uncertainties: [
      'Aucune source retrouvée sur le trainer utilisé comme appareil de première intention selon la sévérité de l\'overjet.',
      'Résumé de la revue française (Amat 2023) lu : les résultats chiffrés portent sur l\'apnée du sommeil, pas sur la Classe II.',
      'Effet sur la correction des habitudes (succion, déglutition, respiration) non documenté dans les sources lues.',
    ],
  },
  {
    id: 'activator',
    name: 'Activateur / Bionator / Andresen',
    family: 'Fonctionnel amovible — sur mesure',
    summary:
      'Appareils fonctionnels sur mesure propulsant la mandibule. Gain squelettique réel mais limité, plus net pendant le pic pubertaire ; effet surtout dentoalvéolaire dans l\'ensemble.',
    principle: [
      {
        text: 'Appareil amovible sur mesure qui maintient la mandibule en avant ; évalué sous forme d\'activateur modifié (Idris), de Bionator (Keeling, Wheeler).',
        level: 'B',
        sources: ['koretsi2015', 'keeling1998', 'idris2019'],
      },
    ],
    mostLogical: [
      {
        text: 'Classe II avec composante mandibulaire, au moment du pic pubertaire (CS3–CS4) : gain de longueur mandibulaire ~2,9 mm vs ~1 mm en prépubère.',
        level: 'A',
        sources: ['perinetti2015rfa', 'cozza2006', 'baccetti2000'],
      },
      {
        text: 'Enfant coopérant : la compliance est corrélée à l\'atteinte de l\'objectif.',
        level: 'A',
        sources: ['wheeler2002'],
      },
      {
        text: 'Versus appareil préfabriqué : meilleur résultat squelettique et dentaire sur 12 mois.',
        level: 'A',
        sources: ['idris2019', 'papageorgiou2019'],
      },
    ],
    discouraged: [
      {
        text: 'Traitement en phase prépubertaire comme stratégie isolée : gain mandibulaire faible, pas d\'avantage final sur un traitement unique à l\'adolescence (sauf pour les traumatismes).',
        level: 'A',
        sources: ['perinetti2015rfa', 'batista2018'],
      },
      {
        text: 'Croissance terminée (CS5–CS6) : effet squelettique attendu non démontré.',
        level: 'A',
        sources: ['perinetti2015ffa', 'cozza2006'],
        note: 'Données post-pubertales très rares ; extrapolées depuis les appareils fixes.',
      },
      {
        text: 'Composante maxillaire dominante : action sur SNA minime (−0,28°/an).',
        level: 'A',
        sources: ['koretsi2015'],
      },
      {
        text: 'Coopération faible : l\'efficacité dépend de la compliance.',
        level: 'A',
        sources: ['wheeler2002'],
      },
    ],
    doesNot: [
      {
        text: 'Ne produit pas, dans la majorité des essais randomisés, de gain mandibulaire cliniquement significatif (> 2 mm) : 0 des 4 essais randomisés de la revue, dont 3 portaient sur des sujets prépubertaires.',
        level: 'A',
        sources: ['cozza2006'],
      },
      {
        text: 'Effets surtout dentoalvéolaires plutôt que squelettiques ; long terme non évalué.',
        level: 'A',
        sources: ['koretsi2015'],
      },
      {
        text: 'Mouvements dentaires qui récidivent à l\'arrêt ; le gain squelettique observé (Bionator, FEO) était stable un an après.',
        level: 'A',
        sources: ['keeling1998'],
      },
    ],
    effects: [
      { text: 'Vs témoins, appareils amovibles : SNA −0,28°/an, SNB +0,62°/an, ANB −1,14°/an.', level: 'A', sources: ['koretsi2015'] },
      { text: 'Longueur mandibulaire totale : +0,95 mm (prépubère) ; +2,91 mm (pubertaire).', level: 'A', sources: ['perinetti2015rfa'] },
    ],
    duration: [
      { text: 'Dans l\'essai Bionator/FEO : jusqu\'à obtention d\'une molaire de Classe I ou 2 ans.', level: 'A', sources: ['keeling1998'] },
    ],
    cooperation: [
      { text: 'Coopération requise ; corrélation compliance–objectif atteint r = 0,50 avec le Bionator.', level: 'A', sources: ['wheeler2002'] },
    ],
    adverse: [
      { text: 'Gêne initiale qui diminue avec le temps ; moins marquée qu\'avec un préfabriqué.', level: 'A', sources: ['idris2012'] },
    ],
    evidenceGrade: 'Modérée (court terme)',
    evidenceText:
      'Plusieurs essais randomisés mais courts ; qualité GRADE faible en prépubère et plutôt modérée en pubertaire dans la méta-analyse de Perinetti ; long terme non évalué.',
    uncertainties: [
      'Pas de source retrouvée distinguant le choix entre Bionator, Andresen et activateur modifié.',
      'Rôle de l\'hyperdivergence : Wheeler 2002 ne retrouve pas d\'effet du plan mandibulaire sur l\'atteinte de l\'objectif ; autre donnée non retrouvée.',
    ],
  },
  {
    id: 'twinblock',
    name: 'Twin Block',
    family: 'Fonctionnel amovible — sur mesure',
    summary:
      'Appareil fonctionnel à deux blocs. Meilleur étayage pour le moment optimal (début du pic pubertaire) ; le Twin Block précoce à 8–10 ans réduit l\'overjet surtout par effet dentoalvéolaire.',
    principle: [
      {
        text: 'Appareil amovible à blocs occlusaux supérieur et inférieur maintenant la mandibule avancée.',
        level: 'B',
        sources: ['obrien2003tb', 'baccetti2000'],
      },
    ],
    mostLogical: [
      {
        text: 'Moment optimal : pendant ou juste après le début du pic pubertaire (CVM), avec contribution squelettique plus grande.',
        level: 'A',
        sources: ['baccetti2000'],
      },
      {
        text: 'Effets squelettiques plus marqués avec le Twin Block qu\'avec les autres appareils amovibles ; ANB −0,56° vs autres appareils chez l\'adolescent.',
        level: 'A',
        sources: ['koretsi2015', 'batista2018'],
      },
    ],
    discouraged: [
      {
        text: 'Début à 8–9 ans en traitement isolé : aucun avantage sur un traitement unique à ~12,4 ans à 10 ans de suivi ; plus de rendez-vous, durée et coût ; occlusion finale moins bonne.',
        level: 'A',
        sources: ['obrien2009'],
      },
      {
        text: 'Coopération incertaine : taux d\'abandon de la phase fonctionnelle de 33,6 % vs 12,9 % avec le Herbst (11–14 ans).',
        level: 'A',
        sources: ['obrien2003herbst', 'pacha2024'],
      },
    ],
    doesNot: [
      {
        text: 'Chez l\'enfant de 8–10 ans : correction surtout dentoalvéolaire ; changement squelettique faible, possiblement sans signification clinique.',
        level: 'A',
        sources: ['obrien2003tb'],
      },
    ],
    effects: [
      { text: 'Coefficient d\'efficacité en longueur mandibulaire : 0,23 mm/mois (revue).', level: 'A', sources: ['cozza2006'] },
    ],
    duration: [{ text: 'Aucune durée standard retrouvée dans les sources lues ; 12 mois dans l\'essai Herbst/Twin Block.', level: 'A', sources: ['pacha2024'] }],
    cooperation: [
      { text: 'Dépend de la coopération : 37,5 % d\'échecs de réduction complète de l\'overjet à 12 mois vs 15,5 % avec Hanks Herbst.', level: 'A', sources: ['pacha2024'] },
    ],
    adverse: [
      { text: 'Abandon de traitement plus fréquent que le Herbst (essais randomisés).', level: 'A', sources: ['obrien2003herbst', 'pacha2024'] },
    ],
    evidenceGrade: 'Modérée',
    evidenceText: 'Plusieurs essais randomisés multicentriques, dont un suivi à 10 ans.',
    uncertainties: ['Les effets sur la hauteur faciale et la rotation mandibulaire n\'ont pas été relevés dans les résumés lus.'],
  },
  {
    id: 'frankel',
    name: 'Régulateur de fonction de Fränkel (FR-2)',
    family: 'Fonctionnel amovible — sur mesure',
    summary: 'Appareil fonctionnel à écrans vestibulaires. Données plus anciennes ou de petit effectif ; un essai randomisé vs FEO chez l\'enfant prépubère.',
    principle: [{ text: 'Appareil fonctionnel amovible de type régulateur de fonction.', level: 'B', sources: ['ghafari1998', 'perillo1996'] }],
    mostLogical: [
      {
        text: 'Classe II à mandibule rétrusive : diminution de l\'ANB et augmentation de la croissance mandibulaire vs témoins, sans rebond ; 14 patients.',
        level: 'A',
        sources: ['perillo1996'],
      },
      {
        text: 'Enfants prépubères : aussi efficace que le FEO pour corriger la Classe II division 1 ; efficacité identique en milieu ou fin d\'enfance.',
        level: 'A',
        sources: ['ghafari1998'],
      },
    ],
    discouraged: [
      {
        text: 'Croissance terminée ou coopération faible : extrapolé depuis les autres appareils amovibles.',
        level: 'NS',
        sources: [],
      },
    ],
    doesNot: [{ text: 'Aucun effet maxillaire noté dans l\'étude de Perillo ; très petit échantillon.', level: 'A', sources: ['perillo1996'] }],
    effects: [{ text: 'ANB diminué et taux de croissance mandibulaire augmenté vs témoins.', level: 'A', sources: ['perillo1996'] }],
    duration: [{ text: 'Aucune source retrouvée.', level: 'NS', sources: [] }],
    cooperation: [{ text: 'Appareil amovible : coopération requise (extrapolation).', level: 'NS', sources: [] }],
    adverse: [{ text: 'Aucune donnée retrouvée dans les résumés lus.', level: 'NS', sources: [] }],
    evidenceGrade: 'Faible',
    evidenceText: 'Un essai randomisé ancien et une étude de 14 patients retrouvés.',
    uncertainties: ['Fiche volontairement brève : peu de sources retrouvées pour guider le choix du Fränkel.'],
  },
  {
    id: 'fixed_functional',
    name: 'Appareils fonctionnels fixes (Herbst, MARA, Forsus)',
    family: 'Fonctionnel fixe',
    summary:
      'Efficaces à court terme, moins dépendants de la coopération. Effets surtout dentoalvéolaires, squelettiques surtout pendant le pic pubertaire ; proclinaison des incisives inférieures.',
    principle: [
      {
        text: 'Appareils non amovibles : Herbst (pistons télescopiques), MARA (mandibular advancement repositioning appliance), Forsus (ressort fixe sur multi-attaches).',
        level: 'B',
        sources: ['zymperdikas2016', 'ghislanzoni2011', 'cacciatore2014'],
      },
    ],
    mostLogical: [
      {
        text: 'Pic pubertaire : gain de longueur mandibulaire ~1,95–2,22 mm ; chez les post-pubertaires, pas de gain squelettique démontré.',
        level: 'A',
        sources: ['perinetti2015ffa'],
      },
      {
        text: 'Coopération douteuse : abandon 12,9 % avec Herbst vs 33,6 % avec Twin Block ; échec de réduction de l\'overjet 15,5 % vs 37,5 %.',
        level: 'A',
        sources: ['obrien2003herbst', 'pacha2024'],
      },
    ],
    discouraged: [
      {
        text: 'Incisives inférieures déjà proclinées : proclinaison supplémentaire (Herbst : avancée des incisives inférieures ; MARA : IMPA +5,8°).',
        level: 'A',
        sources: ['pacha2024', 'ghislanzoni2011'],
        note: 'Récession gingivale : deux positions. Ruf 1998 : 97 % des incisives sans récession après Herbst. Joss-Vassalli 2010 : plus de récession sur les dents plus proclinées, résultats contradictoires, pas d\'étude de haute qualité.',
      },
      {
        text: 'Hygiène insuffisante ou risque carieux élevé (appareil fixe, multi-attaches).',
        level: 'NS',
        sources: [],
      },
    ],
    doesNot: [
      {
        text: 'Ne produit pas de correction uniquement squelettique, même chez les pubertaires ; Forsus : pas de changement squelettique significatif.',
        level: 'A',
        sources: ['perinetti2015ffa', 'cacciatore2014'],
      },
      { text: 'Récidive : overjet 26 % de la correction, overbite 45 % ; stabilité non documentée sauf Herbst.', level: 'A', sources: ['bock2016'] },
      { text: 'Aucun des 4 essais randomisés d\'une revue sur les appareils fonctionnels n\'a montré de gain mandibulaire cliniquement significatif (3 portaient sur des sujets prépubertaires).', level: 'A', sources: ['cozza2006'] },
    ],
    effects: [
      { text: 'Vs témoins : SNA −0,83°/an, SNB +0,87°/an, ANB −1,74°/an (âge moyen 13,5 ans).', level: 'A', sources: ['zymperdikas2016'] },
      { text: 'MARA : Co-Gn +2,2 mm en phase active, +2,0 mm au suivi.', level: 'A', sources: ['ghislanzoni2011'] },
    ],
    duration: [{ text: '12 mois dans l\'essai Herbst/Twin Block ; Herbst : coefficient d\'efficacité 0,28 mm/mois.', level: 'A', sources: ['pacha2024', 'cozza2006'] }],
    cooperation: [{ text: 'Moins dépendants de la coopération du patient (appareil non amovible).', level: 'A', sources: ['obrien2003herbst'] }],
    adverse: [
      { text: 'Plus de rendez-vous de réparation avec le Herbst.', level: 'A', sources: ['obrien2003herbst'] },
      { text: 'DTM : pas de différence de prévalence avant/après Herbst (4 études seulement).', level: 'A', sources: ['minervini2024'] },
      { text: 'Proclinaison des incisives inférieures.', level: 'A', sources: ['pacha2024', 'ghislanzoni2011'] },
    ],
    evidenceGrade: 'Modérée (court terme)',
    evidenceText: 'Plusieurs revues et un essai randomisé ; la stabilité n\'est documentée que pour le Herbst.',
    uncertainties: [
      'Effet de l\'hyperdivergence sur les résultats : Ruf & Pancherz ont publié sur ce sujet (PMID 8760851, 9267575) ; résumés non relus.',
      'Prérequis d\'ancrage en denture mixte précoce : non sourcé.',
    ],
  },
  {
    id: 'headgear',
    name: 'Forces extra-orales (FEO)',
    family: 'Orthopédique maxillaire',
    summary: 'Seule option avec preuve de haute qualité de retrait maxillaire à court terme. Coopération indispensable ; effet qui s\'atténue à long terme.',
    principle: [{ text: 'Traction extra-orale agissant sur le maxillaire et l\'arcade supérieure.', level: 'B', sources: ['papageorgiou2017', 'keeling1998'] }],
    mostLogical: [
      {
        text: 'Prognathie maxillaire en croissance : SNA −1,63°/an (preuve de haute qualité).',
        level: 'A',
        sources: ['papageorgiou2017'],
      },
      {
        text: 'Overjet important avec risque de traumatisme : moins de traumatismes avec le FEO précoce (RR 0,34 ; NNT 6).',
        level: 'A',
        sources: ['papageorgiou2017', 'thiruvenkatachari2015'],
      },
    ],
    discouraged: [
      { text: 'Coopération faible : compliance corrélée à l\'objectif atteint (r = 0,49).', level: 'A', sources: ['wheeler2002'] },
      { text: 'Croissance terminée : effet orthopédique non attendu.', level: 'NS', sources: [] },
    ],
    doesNot: [
      { text: 'Effet clinique qui s\'atténue à long terme (peu de données).', level: 'A', sources: ['papageorgiou2017'] },
      { text: 'Pas d\'autre avantage que la réduction des traumatismes pour un traitement précoce vs tardif.', level: 'A', sources: ['batista2018'] },
    ],
    effects: [
      { text: 'Objectif atteint : médiane 100 % (FEO) vs 83 % (Bionator) vs 14 % (observation) ; analyse multivariée suggérant la supériorité du FEO.', level: 'A', sources: ['wheeler2002'] },
      { text: 'Dans l\'essai Keeling, le gain squelettique des deux groupes (Bionator, FEO) est attribué à la croissance mandibulaire accrue.', level: 'A', sources: ['keeling1998'] },
    ],
    duration: [{ text: 'Aucune durée recommandée retrouvée.', level: 'NS', sources: [] }],
    cooperation: [{ text: 'Coopération élevée requise.', level: 'A', sources: ['wheeler2002'] }],
    adverse: [{ text: 'Aucun effet indésirable chiffré retrouvé dans les résumés lus.', level: 'NS', sources: [] }],
    evidenceGrade: 'Modérée à élevée (maxillaire, court terme)',
    evidenceText: 'Revue de 18 études ; preuve de haute qualité sur le SNA ; peu de données à long terme.',
    uncertainties: ['Disponibilité et acceptabilité en Tunisie : non évaluées dans la littérature retrouvée.'],
  },
  {
    id: 'rme',
    name: 'Disjonction maxillaire rapide (RME)',
    family: 'Prétraitement transversal',
    summary: 'Indiquée pour un déficit transversal. Son effet sur la Classe II sagittale n\'est pas démontré.',
    principle: [{ text: 'Expansion palatine rapide ouvrant la suture médiane chez l\'enfant et l\'adolescent.', level: 'A', sources: ['lione2013'] }],
    mostLogical: [
      {
        text: 'Déficit transversal ou croisement postérieur associé : les Classe II ont fréquemment une arcade maxillaire étroite relative à la mandibule dès la denture temporaire.',
        level: 'A',
        sources: ['baccetti1997'],
      },
    ],
    discouraged: [
      { text: 'Comme seul traitement de la dimension sagittale : effet non prouvé.', level: 'A', sources: ['feres2015'] },
    ],
    doesNot: [
      { text: 'N\'a pas d\'effet sagittal démontré sur la Classe II (7 études, aucun essai randomisé).', level: 'A', sources: ['feres2015'] },
    ],
    effects: [
      {
        text: 'Position opposée : une étude prospective non randomisée rapporte une amélioration de la Classe II avec une RME collée en denture mixte précoce (longueur mandibulaire, Wits, ANB, overjet).',
        level: 'A',
        sources: ['guest2010'],
      },
      { text: 'Ouverture systématique de la suture ; effets verticaux faibles et transitoires.', level: 'A', sources: ['lione2013'] },
    ],
    duration: [{ text: 'Non étudié ici.', level: 'NS', sources: [] }],
    cooperation: [{ text: 'Appareil fixe/collé : peu dépendant de la coopération.', level: 'NS', sources: [] }],
    adverse: [
      { text: 'Inclinaison des dents d\'ancrage de 3,4 à 9,2° ; redressement à long terme ; parodonte non compromis.', level: 'A', sources: ['lione2013'] },
    ],
    evidenceGrade: 'Faible (pour la Classe II)',
    evidenceText: 'Revue de 7 études non randomisées ; données contradictoires.',
    uncertainties: ['Les indications transversales de la RME ne sont pas détaillées ici : un clinicien doit compléter.'],
  },
  {
    id: 'aligner_ma',
    name: 'Aligneurs à avancée mandibulaire',
    family: 'Aligneurs',
    summary: 'Option esthétique en développement rapide ; peu d\'essais randomisés, court terme. Pas de supériorité démontrée sur les appareils fonctionnels classiques.',
    principle: [{ text: 'Aligneurs transparents avec dispositifs d\'avancée mandibulaire.', level: 'B', sources: ['huang2026', 'ravera2021'] }],
    mostLogical: [
      {
        text: 'Effets squelettiques pendant le pic pubertaire (CVM3) ; avant la puberté (CVM2), effets dentoalvéolaires.',
        level: 'A',
        sources: ['ravera2021'],
        note: 'Étude contrôlée prospective, court terme.',
      },
    ],
    discouraged: [
      { text: 'Peu de preuves : dans la méta-analyse récente, 1 seul essai randomisé sur 9 études.', level: 'A', sources: ['huang2026'] },
      { text: 'Traitement précoce chez l\'enfant de 6–13 ans : lacunes de preuves signalées.', level: 'A', sources: ['sipiyaruk2026'], note: 'D\'après le titre de la revue de portée.' },
      { text: 'Coopération faible (port quasi permanent requis) : extrapolation non sourcée.', level: 'NS', sources: [] },
    ],
    doesNot: [
      { text: 'Pas de différence significative avec les appareils fonctionnels sur SNA, SNB, ANB, longueur mandibulaire dans une méta-analyse de 5 études : pas de supériorité démontrée.', level: 'A', sources: ['sohn2026'] },
      { text: 'Volumes maxillaire et mandibulaire sans différence significative avec les témoins (essai CBCT, 55 patients).', level: 'A', sources: ['kavasoglu2026'] },
    ],
    effects: [{ text: 'Court terme : réduction de l\'ANB, du Wits en CVM2 ; hausse de Co-Gn en CVM3.', level: 'A', sources: ['ravera2021'] }],
    duration: [{ text: 'Non établie.', level: 'NS', sources: [] }],
    cooperation: [{ text: 'Coopération élevée supposée ; mesurable par capteurs sur appareils amovibles.', level: 'NS', sources: ['moreno2022'] }],
    adverse: [{ text: 'Non documentés dans les résumés lus.', level: 'NS', sources: [] }],
    evidenceGrade: 'Faible',
    evidenceText: 'Majorité d\'études non randomisées ; court terme ; synthèses divergentes sur la comparaison avec les appareils classiques.',
    uncertainties: ['Les résultats chiffrés de Huang 2026 n\'ont pas été lus (seule la méthode du résumé).'],
  },
  {
    id: 'elastics',
    name: 'Élastiques de Classe II',
    family: 'Camouflage dentoalvéolaire',
    summary: 'Correction essentiellement dentoalvéolaire, adaptée à la denture permanente et à la fin de croissance.',
    principle: [{ text: 'Élastiques intermaxillaires sur multi-attaches.', level: 'B', sources: ['janson2013'] }],
    mostLogical: [
      { text: 'Fin de croissance / denture permanente avec objectif de correction dentoalvéolaire (effet comparable à long terme aux fonctionnels fixes).', level: 'A', sources: ['janson2013'] },
    ],
    discouraged: [
      { text: 'Avant la puberté, en denture mixte : hors des conditions des études retrouvées.', level: 'NS', sources: [] },
      { text: 'Incisives inférieures déjà proclinées (tendance à la proclinaison) : extrapolation non sourcée.', level: 'NS', sources: [] },
    ],
    doesNot: [{ text: 'N\'agit pas sur la croissance squelettique : effets surtout dentoalvéolaires.', level: 'A', sources: ['janson2013'] }],
    effects: [{ text: 'Corrige la malocclusion, effets dentoalvéolaires ; peu de données sur les tissus mous.', level: 'A', sources: ['janson2013'] }],
    duration: [{ text: 'Non établie.', level: 'NS', sources: [] }],
    cooperation: [{ text: 'Coopération requise.', level: 'NS', sources: [] }],
    adverse: [{ text: 'Non documentés dans le résumé lu.', level: 'NS', sources: [] }],
    evidenceGrade: 'Faible à modérée',
    evidenceText: '11 études, hétérogènes, pas de méta-analyse.',
    uncertainties: ['Aucune donnée tunisienne ; effets sur la hauteur faciale non lus.'],
  },
  {
    id: 'distalization',
    name: 'Distalisation maxillaire',
    family: 'Camouflage dentoalvéolaire',
    summary: 'Distalisation molaire efficace mais avec perte d\'ancrage si ancrage conventionnel ; l\'ancrage squelettique limite cette perte.',
    principle: [{ text: 'Distalisateurs intra-buccaux avec ancrage conventionnel ou squelettique.', level: 'A', sources: ['grec2013'] }],
    mostLogical: [
      { text: 'Camouflage maxillaire en denture permanente ; ancrage squelettique : 5,10 mm de distalisation molaire sans perte d\'ancrage en ancrage direct.', level: 'A', sources: ['grec2013'] },
    ],
    discouraged: [
      { text: 'Ancrage conventionnel : mésialisation des prémolaires de 2,30 mm ; perte d\'ancrage inévitable avec les distalisateurs sans coopération.', level: 'A', sources: ['grec2013', 'antonarakis2008'] },
    ],
    doesNot: [{ text: 'N\'agit pas sur la composante mandibulaire ni sur la croissance.', level: 'NS', sources: [] }],
    effects: [{ text: 'Distalisation molaire moyenne 3,34 mm (ancrage conventionnel) vs 5,10 mm (squelettique).', level: 'A', sources: ['grec2013'] }],
    duration: [{ text: 'Non établie.', level: 'NS', sources: [] }],
    cooperation: [{ text: 'Variable selon l\'appareil (« sans coopération » ou avec).', level: 'A', sources: ['antonarakis2008'] }],
    adverse: [{ text: 'Perte d\'ancrage ; inclinaison molaire.', level: 'A', sources: ['antonarakis2008'] }],
    evidenceGrade: 'Modérée (quantité de distalisation)',
    evidenceText: '40 études dont 2 de haute qualité.',
    uncertainties: ['Âge d\'application et stabilité non lus.'],
  },
  {
    id: 'observation',
    name: 'Abstention / surveillance',
    family: 'Stratégie',
    summary:
      'Attendre la fenêtre pubertaire est une option étayée : le traitement précoce n\'apporte pas de meilleur résultat final, sauf sur les traumatismes.',
    principle: [{ text: 'Suivi régulier sans appareillage jusqu\'à la fenêtre de croissance favorable.', level: 'B', sources: ['batista2018'] }],
    mostLogical: [
      {
        text: 'Patient prépubère sans risque traumatique marqué ni retentissement psychosocial : pas de différence de résultat final entre traitement précoce en 2 phases et traitement unique à l\'adolescence.',
        level: 'A',
        sources: ['batista2018', 'tulloch2004', 'obrien2009'],
      },
    ],
    discouraged: [
      {
        text: 'Overjet important avec antécédent ou risque traumatique : le traitement précoce réduit l\'incidence des traumatismes (19 % vs 30 %).',
        level: 'A',
        sources: ['batista2018', 'thiruvenkatachari2015', 'petti2015'],
      },
      {
        text: 'Retentissement psychosocial (moqueries) : un traitement interceptif est associé à moins de harcèlement rapporté.',
        level: 'A',
        sources: ['seehra2013'],
        note: 'Étude de 43 adolescents harcelés, non randomisée.',
      },
    ],
    doesNot: [
      {
        text: 'Ne corrige pas spontanément la Classe II : les signes occlusaux persistent ou s\'aggravent entre denture temporaire et mixte.',
        level: 'A',
        sources: ['baccetti1997'],
      },
    ],
    effects: [{ text: 'Groupe observation : objectif atteint médiane 14 %.', level: 'A', sources: ['wheeler2002'] }],
    duration: [{ text: 'Rythme de surveillance : aucune source retrouvée.', level: 'NS', sources: [] }],
    cooperation: [{ text: 'Aucune coopération thérapeutique requise ; assiduité au suivi.', level: 'NS', sources: [] }],
    adverse: [{ text: 'Risque de traumatisme incisif non réduit.', level: 'A', sources: ['batista2018'] }],
    evidenceGrade: 'Modérée',
    evidenceText: 'Qualité modérée sur les traumatismes et faible sur les autres critères (revue Cochrane).',
    uncertainties: ['Fréquence de réévaluation et seuils de bascule vers un traitement : à définir par le clinicien.'],
  },
];

export const APPLIANCE_BY_ID: Record<ApplianceId, Appliance> = Object.fromEntries(APPLIANCES.map((a) => [a.id, a])) as Record<ApplianceId, Appliance>;
