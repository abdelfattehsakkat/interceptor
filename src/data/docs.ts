import type { Claim } from '../types';

export interface DocBlock {
  heading?: string;
  text?: string[];
  table?: { head: string[]; rows: string[][] };
  claims?: Claim[];
}

export interface DocPage {
  id: string;
  title: string;
  intro: string;
  blocks: DocBlock[];
}

export const DOCS: DocPage[] = [
  {
    id: 'lecture',
    title: 'Lire le guide',
    intro: 'Comment interpréter les niveaux de preuve, les types de règles et les statuts affichés.',
    blocks: [
      {
        heading: 'Niveaux de preuve',
        table: {
          head: ['Niveau', 'Signification'],
          rows: [
            ['A', 'Issu d\'études publiées (essais randomisés, méta-analyses, revues systématiques, études contrôlées). La force réelle varie : voir la fiche de la source.'],
            ['B', 'Consensus clinique ou enseignement classique, sans étude directe retrouvée.'],
            ['C', 'Opinion ou pratique locale.'],
            ['NS', 'Non sourcé : le guide l\'affiche mais ne l\'érige pas en règle.'],
          ],
        },
      },
      {
        heading: 'Types de règle (par priorité décroissante)',
        table: {
          head: ['Type', 'Rôle'],
          rows: [
            ['Abstention', 'Le guide refuse de conclure et dit quoi renseigner.'],
            ['Garde-fou', 'Condition qui pèse fortement sur le choix d\'un appareil.'],
            ['Prétraitement', 'Acte à envisager avant le traitement principal.'],
            ['Orientation', 'Piste d\'appareillage selon le profil.'],
            ['Information', 'Remarque sans effet sur le classement.'],
          ],
        },
      },
      {
        heading: 'Statuts des options',
        text: [
          'Piste logique, possible avec réserves, peu adapté, déconseillé dans ce profil, non évaluable. Ce sont des aides à la réflexion : le praticien décide.',
          'Une option n\'est classée « piste logique » que si la composante saisie correspond à ce sur quoi elle agit ; les aligneurs à avancée et le Fränkel sont plafonnés en raison du faible niveau de preuve ; la division 2 plafonne les pistes.',
        ],
      },
    ],
  },
  {
    id: 'diagnostic',
    title: 'Diagnostic de la Classe II',
    intro: 'Squelettique, dentaire ou mixte ; composante maxillaire, mandibulaire ou combinée.',
    blocks: [
      {
        heading: 'Ce que montre la littérature',
        claims: [
          {
            text: 'Les signes de Classe II sont déjà présents en denture temporaire (rétrusion et petite taille mandibulaires, arcade maxillaire étroite) et persistent ou s\'aggravent en denture mixte chez les sujets non traités.',
            level: 'A',
            sources: ['baccetti1997'],
          },
          {
            text: 'La proportion de rétrusion mandibulaire ou de protrusion maxillaire dépend fortement de l\'indicateur céphalométrique : 27 % de rétrusion avec l\'angle facial de Downs, 56 % de protrusion avec NA-FH dans un même échantillon.',
            level: 'A',
            sources: ['rosenblum1995'],
          },
        ],
      },
      {
        heading: 'Conséquence pour l\'outil',
        text: ['La composante dominante est saisie par le praticien : le guide affiche SNA, SNB, ANB et Wits comme appui, sans décider à sa place.'],
      },
    ],
  },
  {
    id: 'ceph',
    title: 'Mesures céphalométriques',
    intro: 'Ce que chaque mesure apporte, et ses limites.',
    blocks: [
      {
        table: {
          head: ['Mesure', 'Apport', 'Limites documentées'],
          rows: [
            ['ANB', 'Discordance sagittale maxillo-mandibulaire.', 'Varie avec la rotation des maxillaires, la position de N, la hauteur faciale et dentaire, même pour un Wits nul (Hussels 1984).'],
            ['Wits', 'Projection de A et B sur le plan d\'occlusion ; Classe II = valeur positive.', 'Dépend du plan d\'occlusion ; échantillon de référence d\'adultes (Jacobson 1975).'],
            ['SNA, SNB', 'Position du maxillaire et de la mandibule par rapport à la base du crâne.', 'Dépendent de la position de N.'],
            ['Divergence, IMPA, incisives', 'Typologie verticale et inclinaison incisive.', 'Seuils chiffrés non repris dans ce guide (non sourcés) : la typologie est saisie par le praticien.'],
          ],
        },
      },
      {
        claims: [
          {
            text: 'Toute mesure sur téléradiographie dépend de l\'identification des points : une erreur de repérage existe. L\'étude de référence sur ce sujet n\'a pas de résumé consultable.',
            level: 'A',
            sources: ['baumrind1971'],
            note: 'Titre uniquement.',
          },
          {
            text: 'Valeurs de référence : l\'analyse de McNamara fournit des normes, issues d\'une autre population. Aucune norme céphalométrique tunisienne exploitable retrouvée.',
            level: 'A',
            sources: ['mcnamara1984', 'benamor2003'],
          },
        ],
      },
    ],
  },
  {
    id: 'maturation',
    title: 'Maturation et CVM',
    intro: 'Stades CS1–CS6, fiabilité, alternatives.',
    blocks: [
      {
        claims: [
          {
            text: 'CS1–CS2 prépubertaires, CS3–CS4 circumpubertaires, CS5–CS6 postpubertaires (analyse de C2, C3, C4 sur téléradiographie de profil).',
            level: 'A',
            sources: ['mcnamara2018'],
          },
          {
            text: 'Le plus grand incrément de longueur mandibulaire survient entre CS3 et CS4, avec le pic de croissance staturale.',
            level: 'A',
            sources: ['franchi2000'],
          },
        ],
      },
      {
        heading: 'Fiabilité : deux positions',
        table: {
          head: ['Position', 'Données', 'Sources'],
          rows: [
            ['Défavorable', 'Concordance inter-observateurs < 50 %, intra-observateur 62 % ; ~30 % de cas non classables ; la CVM n\'est pas recommandée comme guide strict.', 'Gabriel 2009 ; Nestman 2011'],
            ['Favorable', 'Environ 68 % de concordance avec la référence, 76,9 % en intra-observateur ; erreurs surtout d\'un stade, aux stades 4 et 5.', 'Perinetti 2014'],
            ['Validité vs main-poignet', 'Corrélation positive entre CVM et méthode carpienne ; plus élevée chez les filles.', 'Cericato 2015 ; Szemraj 2018'],
          ],
        },
      },
      {
        heading: 'Alternative dentaire',
        claims: [
          {
            text: 'La maturité dentaire sur panoramique n\'est utile que pour identifier la phase prépubertaire ; elle ne renseigne pas sur le début du pic de croissance.',
            level: 'A',
            sources: ['perinetti2012dental'],
          },
        ],
      },
    ],
  },
  {
    id: 'timing',
    title: 'Timing : précoce ou tardif',
    intro: 'Ce que disent les essais sur le traitement précoce en deux phases.',
    blocks: [
      {
        claims: [
          {
            text: 'Traitement précoce (2 phases) vs tardif (1 phase) : pas de différence d\'overjet ni d\'ANB en fin de traitement ; seule différence démontrée = moins de traumatismes incisifs (19 % vs 30 %, preuve modérée).',
            level: 'A',
            sources: ['batista2018', 'thiruvenkatachari2015'],
          },
          {
            text: 'Essai de Tulloch : les différences créées par la phase 1 disparaissent après le traitement fixe de l\'adolescence.',
            level: 'A',
            sources: ['tulloch2004'],
          },
          {
            text: 'Twin Block à 8-9 ans : aucun avantage sur un traitement unique à ~12,4 ans à 10 ans de suivi ; plus de rendez-vous et de coût.',
            level: 'A',
            sources: ['obrien2009'],
          },
          {
            text: 'Gain mandibulaire supplémentaire des appareils amovibles : ~0,95 mm en prépubère vs ~2,91 mm en pubertaire.',
            level: 'A',
            sources: ['perinetti2015rfa'],
          },
        ],
      },
      {
        heading: 'Lecture',
        text: ['Les deux positions coexistent : attendre la fenêtre pubertaire (résultats équivalents) ou intervenir tôt (moins de traumatismes). Le guide présente les deux et laisse le choix.'],
      },
    ],
  },
  {
    id: 'imagerie',
    title: 'Imagerie',
    intro: 'Téléradiographie, panoramique, CBCT.',
    blocks: [
      {
        claims: [
          {
            text: 'Le CBCT en orthodontie doit être justifié au cas par cas selon la présentation clinique (consensus d\'experts).',
            level: 'B',
            sources: ['aaomr2013'],
          },
          {
            text: 'Recommandations plus récentes ADA/AAOMR sur la sélection des patients pour la radiographie et le CBCT existent ; leur résumé n\'a pas été lu.',
            level: 'B',
            sources: ['benavides2026'],
          },
        ],
      },
      {
        text: ['Le panoramique sert au dépistage des germes, agénésies et inclusions ; aucune source n\'a été retrouvée dans cette phase pour en chiffrer l\'apport.'],
      },
    ],
  },
  {
    id: 'tunisie',
    title: 'Contexte tunisien',
    intro: 'Périmètre d\'usage du guide.',
    blocks: [
      {
        claims: [
          {
            text: 'Seule étude tunisienne retrouvée : 53 étudiants à denture normale, valeurs esthétiques et céphalométriques différentes des moyennes orthodontiques classiques. Elle ne fournit pas de normes céphalométriques exploitables telles quelles.',
            level: 'A',
            sources: ['benamor2003'],
          },
        ],
      },
      {
        text: [
          'Aucune donnée sur la disponibilité des appareils, leur coût ou les pratiques en Tunisie n\'a été retrouvée : le guide ne les modélise pas.',
          'Le cadre réglementaire (dispositif médical, données de santé) est traité à part.',
        ],
      },
    ],
  },
];
