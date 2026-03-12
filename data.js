window.PMP_CONFIG = {
  brand: {
    appName: "PMP A4P – Profil Mental de Performance",
    baseline: "Version Ultra Premium – signature A4P pour jeunes sportifs",
    company: "Académie de Performances – A4P"
  },
  dimensions: {
    activation:{label:"Activation",description:"Capacité à mobiliser son énergie mentale avant et pendant la performance.",low:"Peut traduire un démarrage lent, une mise en route prudente ou un manque d'intensité.",high:"Traduit souvent une capacité à se mettre rapidement en action et à répondre au défi."},
    attention:{label:"Attention",description:"Capacité à rester focalisé sur l'essentiel malgré les distractions.",low:"Peut indiquer une dispersion de l'attention, une difficulté à revenir dans l'instant.",high:"Traduit souvent une forte capacité de concentration et de refocalisation."},
    regulation:{label:"Régulation",description:"Capacité à gérer ses émotions et son niveau de tension intérieure.",low:"Peut signaler une sensibilité accrue au stress, à la frustration ou à l'erreur.",high:"Traduit souvent une bonne stabilité émotionnelle dans les moments exigeants."},
    engagement:{label:"Engagement",description:"Capacité à rester investi et volontaire dans l'effort.",low:"Peut signaler une baisse d'implication dès que la situation devient difficile.",high:"Traduit une forte présence, une intention claire et une persévérance mentale."},
    confiance:{label:"Confiance",description:"Croyance en ses capacités à répondre présent et à progresser.",low:"Peut révéler un doute important ou une estime de soi trop dépendante des résultats.",high:"Traduit une solidité intérieure et une confiance mobilisable sous pression."},
    resilience:{label:"Résilience",description:"Capacité à rebondir après l'échec, l'erreur ou la contrariété.",low:"Peut indiquer une tendance à ruminer ou à rester bloqué après un revers.",high:"Traduit la capacité à repartir, apprendre et se reconstruire dans l'action."},
    cognition:{label:"Cognition",description:"Capacité à comprendre, analyser, anticiper et décider avec lucidité.",low:"Peut traduire une lecture tardive de la situation ou un manque de recul stratégique.",high:"Traduit une bonne clarté mentale et une lecture rapide des situations."},
    motricite:{label:"Motricité",description:"Capacité à ressentir, organiser et ajuster le mouvement avec finesse.",low:"Peut signaler peu de repères corporels ou une difficulté à sentir l'ajustement juste.",high:"Traduit un bon lien entre sensations, geste et efficacité motrice."}
  },
  mbtiToMotor: {
    ESTP:"D1", ISTP:"D2", ESTJ:"D3", ISTJ:"D4",
    ESFP:"G1", ISFP:"G2", ESFJ:"G3", ISFJ:"G4",
    ENFP:"R1", INFP:"R2", ENFJ:"R3", INFJ:"R4",
    ENTP:"C1", INTP:"C2", ENTJ:"C3", INTJ:"C4"
  },
  motorExplanations: {
    D1:"Famille ST. Préférence motrice probable orientée vers une organisation concrète, réactive et appuyée.",
    D2:"Famille ST. Préférence motrice probable plus intériorisée, avec recherche de précision et d'efficacité.",
    D3:"Famille ST. Préférence motrice probable structurée, engagée, avec besoin d'ordre et de repères nets.",
    D4:"Famille ST. Préférence motrice probable stable, rigoureuse, avec besoin de cohérence technique.",
    G1:"Famille SF. Préférence motrice probable relationnelle, fluide, sensible au rythme et à l'ambiance.",
    G2:"Famille SF. Préférence motrice probable fine, ressentie, avec besoin d'accord intérieur dans le geste.",
    G3:"Famille SF. Préférence motrice probable structurée et chaleureuse, cherchant l'harmonie dans l'exécution.",
    G4:"Famille SF. Préférence motrice probable stable, attentive, avec recherche d'un geste sûr et régulier.",
    R1:"Famille NF. Préférence motrice probable orientée vers l'adaptation, la créativité et une entrée dans l'action par la liberté.",
    R2:"Famille NF. Préférence motrice probable plus intérieure, intuitive, sensible au sens et à la cohérence ressentie.",
    R3:"Famille NF. Préférence motrice probable expressive, impliquée, avec besoin de direction claire et de liberté d'ajustement.",
    R4:"Famille NF. Préférence motrice probable profonde, construite, avec forte recherche d'alignement intérieur.",
    C1:"Famille NT. Préférence motrice probable orientée vers l'invention, la stratégie et l'exploration rapide.",
    C2:"Famille NT. Préférence motrice probable analytique, autonome, avec besoin de comprendre pour ajuster.",
    C3:"Famille NT. Préférence motrice probable structurée, stratégique, tournée vers l'efficacité et la décision.",
    C4:"Famille NT. Préférence motrice probable très réfléchie, cohérente, avec recherche d'optimisation."
  },
  profileFormulas: {
    "Compétiteur":["activation","engagement","confiance"],
    "Stratège":["cognition","attention","regulation"],
    "Créatif":["cognition","activation","motricite"],
    "Régulateur":["regulation","attention","resilience"],
    "Endurant":["resilience","engagement","confiance"],
    "Méthodique":["attention","motricite","cognition"]
  },
  blockNames: [
    "Activation","Attention","Régulation","Engagement",
    "Confiance","Résilience","Cognition","Motricité","Lecture cognitive"
  ],
  scoreLegend: [
    {min:80,label:"force mentale"},
    {min:60,label:"zone solide"},
    {min:40,label:"zone moyenne"},
    {min:0,label:"zone de travail"}
  ]
};