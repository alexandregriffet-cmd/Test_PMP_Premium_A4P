window.PMPReport = {
  scoreBand(score, config){
    const hit = config.scoreLegend.find(s => score >= s.min);
    return hit ? hit.label : '';
  },

  buildNarrative(report, config){
    const dims = config.dimensions;
    const orderedHigh = Object.entries(report.scores).sort((a,b) => b[1]-a[1]).slice(0,3).map(([k]) => dims[k].label);
    const orderedLow = Object.entries(report.scores).sort((a,b) => a[1]-b[1]).slice(0,3).map(([k]) => dims[k].label);
    const top = report.profiles[0]?.name || "Profil principal";
    const second = report.profiles[1]?.name || "Profil secondaire";

    const pressureSentence = report.pressureIndex >= 70
      ? "une capacité plutôt solide à rester opérationnel quand l'enjeu monte"
      : report.pressureIndex >= 55
      ? "un potentiel réel mais encore irrégulier dans la gestion des moments tendus"
      : "une sensibilité marquée à l'enjeu et au risque de perte de moyens";

    const learningSentence = report.learningStyle === 'Analytique'
      ? "il comprend précisément le sens, la logique et les repères de ce qu'il travaille"
      : report.learningStyle === 'Expérientiel'
      ? "il peut ressentir, essayer, ajuster et apprendre en action"
      : report.learningStyle === 'Compétitif'
      ? "l'entraînement contient de l'intensité, du défi et un niveau d'engagement élevé"
      : "le cadre est stable, répétitif et structuré, avec des étapes claires";

    return {
      portrait: `Le profil global met en évidence un fonctionnement mental dominé par le style ${top.toLowerCase()}, soutenu par une composante ${second.toLowerCase()}. Les points d'appui les plus visibles se situent sur ${orderedHigh.join(', ')}, ce qui dessine un sportif capable d'utiliser certains leviers mentaux avec déjà une vraie solidité.`,
      pression: `Sous pression, le fonctionnement semble surtout dépendre de la combinaison entre régulation, confiance et résilience. L'indice de réaction à la pression atteint ${report.pressureIndex} / 100. Cela suggère ${pressureSentence}.`,
      apprentissage: `Le style d'apprentissage dominant est "${report.learningStyle}". Cela signifie que le sportif progresse le mieux quand ${learningSentence}.`,
      progression: `Les trois axes prioritaires de progression sont actuellement : ${orderedLow.join(', ')}. L'objectif n'est pas de corriger une faiblesse théorique, mais de transformer ces zones en leviers de stabilité, de confiance et d'efficacité sportive.`
    };
  },

  buildDimensionCards(report, config){
    return Object.entries(report.scores).map(([key,score]) => {
      const info = config.dimensions[key];
      return `
        <div class="kpi-card">
          <div class="pill">${info.label}</div>
          <div class="big-number">${score}</div>
          <div class="muted">${this.scoreBand(score, config)}</div>
          <p><strong>Lecture :</strong> ${score >= 60 ? info.high : info.low}</p>
        </div>
      `;
    }).join('');
  },

  buildPriorities(report){
    const adviceMap = {
      'Attention':"Travail recommandé : routines de focalisation, repères externes simples, retour rapide à l'instant présent.",
      'Régulation':"Travail recommandé : respiration, reset émotionnel, lecture du stress et récupération mentale.",
      'Confiance':"Travail recommandé : repères de compétence, dialogue interne, ancrage des réussites.",
      'Résilience':"Travail recommandé : débrief bref, relance après erreur, culture de l'apprentissage.",
      'Activation':"Travail recommandé : routine d'entrée, mobilisation énergétique, intention de départ.",
      'Engagement':"Travail recommandé : objectifs d'intention, engagement sur l'effort, relance dans la difficulté.",
      'Cognition':"Travail recommandé : lecture de jeu, anticipation, verbalisation des choix.",
      'Motricité':"Travail recommandé : sensations, appuis, rythme, lien entre correction et ressenti."
    };
    const low = Object.entries(report.scores).sort((a,b) => a[1]-b[1]).slice(0,3).map(([k,v]) => ({label: window.PMP_CONFIG.dimensions[k].label, score:v}));
    return low.map((item, idx) => `
      <div class="kpi-card">
        <div class="pill">Priorité ${idx + 1}</div>
        <div class="section-value">${item.label}</div>
        <div class="muted">${item.score} / 100</div>
        <p>${adviceMap[item.label] || ""}</p>
      </div>
    `).join('');
  },

  render(target, report, state){
    const config = window.PMP_CONFIG;
    const athlete = report.athlete || {};
    const narrative = this.buildNarrative(report, config);
    target.innerHTML = `
      <section class="report-section cover">
        <div class="cover-grid">
          <div>
            <div class="eyebrow">Passeport Mental du Sportif</div>
            <h2>${config.brand.appName}</h2>
            <p class="lead">Comprendre son mental pour mieux construire sa performance.</p>
            <p class="muted">Version Ultra Premium – lecture dimensionnelle, profil mental, équivalence cognitive inspirée MBTI et préférence motrice associée.</p>
          </div>
          <div class="cover-side">
            <div class="meta-card"><span>Sportif</span><strong>${athlete.name || "Sportif A4P"}</strong></div>
            <div class="meta-card"><span>Âge</span><strong>${athlete.age || "—"}</strong></div>
            <div class="meta-card"><span>Sport</span><strong>${athlete.sport || "—"}</strong></div>
            <div class="meta-card"><span>Date</span><strong>${new Date().toLocaleDateString('fr-FR')}</strong></div>
            <div class="meta-card"><span>Version</span><strong>Ultra Premium V3</strong></div>
          </div>
        </div>
      </section>

      <section class="report-section">
        <h3>Présentation du test</h3>
        <p>Ce test comprend <strong>136 questions</strong> : 120 questions mentales réparties en 8 dimensions et 16 questions cognitives pour produire une lecture inspirée MBTI, puis une correspondance en préférences motrices. L'outil est conçu pour accompagner la compréhension du fonctionnement mental du sportif, pas pour établir un diagnostic médical ni un MBTI officiel.</p>
        <div class="triple-grid">
          <div class="kpi-card"><div class="pill">Indice global A4P</div><div class="big-number">${report.globalIndex}</div><div class="muted">${report.globalBand}</div></div>
          <div class="kpi-card"><div class="pill">Indice pression</div><div class="big-number">${report.pressureIndex}</div><div class="muted">${this.scoreBand(report.pressureIndex, config)}</div></div>
          <div class="kpi-card"><div class="pill">Indice stabilité</div><div class="big-number">${report.stabilityIndex}</div><div class="muted">${this.scoreBand(report.stabilityIndex, config)}</div></div>
        </div>
      </section>

      <section class="report-section">
        <h3>Carte mentale du sportif</h3>
        <div class="radar-layout">
          <div class="canvas-card"><canvas id="reportRadar" width="520" height="420"></canvas></div>
          <div class="legend-card">
            ${Object.entries(report.scores).map(([key, score]) => `
              <div class="legend-row"><strong>${config.dimensions[key].label}</strong><span>${score} / 100</span></div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="report-section">
        <h3>Portrait mental global</h3>
        <p>${narrative.portrait}</p>
        <p>${narrative.pression}</p>
        <p>${narrative.apprentissage}</p>
      </section>

      <section class="report-section">
        <h3>Forces mentales et lecture détaillée des dimensions</h3>
        <div class="quad-grid">
          ${this.buildDimensionCards(report, config)}
        </div>
      </section>

      <section class="report-section">
        <h3>Profils mentaux dominants</h3>
        <div class="triple-grid">
          ${report.profiles.slice(0,3).map((p, idx) => `
            <div class="kpi-card">
              <div class="pill">${idx===0 ? "Profil principal" : idx===1 ? "Profil secondaire" : "Profil tertiaire"}</div>
              <div class="section-value">${p.name}</div>
              <div class="muted">${p.value} / 100</div>
              <p>${idx===0 ? "Style actuellement le plus visible dans l'organisation mentale du sportif." : "Composante complémentaire qui enrichit le fonctionnement global."}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="report-section">
        <h3>Signature mentale A4P</h3>
        <div class="quad-grid">
          <div class="kpi-card"><div class="pill">Profil mental</div><div class="section-value">${report.profiles[0].name}</div></div>
          <div class="kpi-card"><div class="pill">Type cognitif probable</div><div class="section-value">${report.mbtiType}</div></div>
          <div class="kpi-card"><div class="pill">Préférence motrice</div><div class="section-value">${report.motor}</div><div class="muted">Famille ${report.motorFamily}</div></div>
          <div class="kpi-card"><div class="pill">Style d'apprentissage</div><div class="section-value">${report.learningStyle}</div></div>
        </div>
        <p><strong>Lecture cognitive :</strong> ${report.mbtiType} est une équivalence de travail inspirée des axes E/I, S/N, T/F et J/P. Elle sert à l'accompagnement et ne remplace pas un test MBTI officiel.</p>
        <p><strong>Lecture motrice :</strong> ${report.motor !== '—' ? (window.PMP_CONFIG.motorExplanations[report.motor] || '') : 'Aucune correspondance disponible.'}</p>
        <p><strong>Indice de cohérence cognition / motricité :</strong> ${report.coherenceIndex} / 100 — ${report.coherenceIndex >= 75 ? 'cohérence forte' : report.coherenceIndex >= 60 ? 'cohérence intermédiaire' : 'profil mixte à explorer sur le terrain'}.</p>
      </section>

      <section class="report-section">
        <h3>Fonctionnement sous pression</h3>
        <p>L'indice de pression repose sur la combinaison de la régulation émotionnelle, de la confiance et de la résilience. Il permet d'apprécier la manière dont le sportif réagit lorsque l'enjeu monte, qu'une erreur apparaît ou que l'environnement devient plus instable.</p>
        <p>À ce stade, le score de <strong>${report.pressureIndex} / 100</strong> indique ${report.pressureIndex >= 70 ? "une base solide pour rester opérationnel et disponible mentalement dans les moments qui comptent." : report.pressureIndex >= 55 ? "une capacité présente mais encore inégale, qui mérite d'être consolidée avec des routines et des repères de récupération." : "une zone de vigilance majeure : le sportif peut perdre des moyens, se crisper ou s'éparpiller quand la pression augmente."}</p>
      </section>

      <section class="report-section">
        <h3>Axes de progression prioritaires</h3>
        <p>${narrative.progression}</p>
        <div class="triple-grid">${this.buildPriorities(report)}</div>
      </section>

      <section class="report-section">
        <h3>Plan de progression mentale – 4 semaines</h3>
        <div class="quad-grid">
          <div class="kpi-card"><div class="pill">Semaine 1</div><div class="section-value">Lucidité</div><p>Observer son fonctionnement, ses déclencheurs et ses repères de concentration. Noter les situations où l'on perd ou retrouve ses moyens.</p></div>
          <div class="kpi-card"><div class="pill">Semaine 2</div><div class="section-value">Régulation</div><p>Installer une routine respiration + reset pour revenir vite dans l'instant après l'erreur, la frustration ou la montée de stress.</p></div>
          <div class="kpi-card"><div class="pill">Semaine 3</div><div class="section-value">Engagement</div><p>Définir une intention claire, un niveau d'effort et un comportement de relance pour rester volontaire dans les moments exigeants.</p></div>
          <div class="kpi-card"><div class="pill">Semaine 4</div><div class="section-value">Autonomie</div><p>Transformer le bilan en habitudes utiles et en repères personnels durables pour performer avec plus d'indépendance.</p></div>
        </div>
      </section>

      <section class="report-section">
        <h3>Lecture jeune – parents – coach</h3>
        <div class="triple-grid">
          <div class="kpi-card"><div class="pill">Pour le sportif</div><p>Utilise ce rapport pour comprendre comment tu fonctionnes, ce qui t'aide à performer et ce qui demande plus de travail. L'objectif n'est pas d'être parfait, mais de devenir plus lucide, plus régulé, plus engagé et plus autonome.</p></div>
          <div class="kpi-card"><div class="pill">Pour les parents</div><p>Le bon soutien consiste à aider le jeune à lire son fonctionnement, à valoriser ses progrès et à ne pas réduire sa valeur à un résultat. Une bonne lecture du profil aide à mieux encourager.</p></div>
          <div class="kpi-card"><div class="pill">Pour le coach</div><p>Le rapport permet d'ajuster le feedback, le cadre, la charge émotionnelle et le mode d'apprentissage. La lecture cognition + motricité sert à affiner les consignes et l'accompagnement.</p></div>
        </div>
      </section>

      <section class="report-section">
        <h3>Passeport mental</h3>
        <p>Chaque passation peut être conservée localement dans le navigateur pour suivre l'évolution du sportif dans le temps. Cette version stocke l'historique sur le poste utilisé. La version SaaS permettra ensuite d'ouvrir ce passeport au club, au coach et aux accompagnants autorisés.</p>
        <div class="history-table-wrap">
          <table class="history-table">
            <thead><tr><th>Date</th><th>Indice global</th><th>Profil principal</th><th>MBTI</th><th>Préférence motrice</th></tr></thead>
            <tbody>
              ${(state.history || []).slice(-5).reverse().map(item => `
                <tr><td>${item.date}</td><td>${item.globalIndex}</td><td>${item.profile}</td><td>${item.mbtiType}</td><td>${item.motor}</td></tr>
              `).join('') || '<tr><td colspan="5">Aucun historique local enregistré pour le moment.</td></tr>'}
            </tbody>
          </table>
        </div>
      </section>

      <section class="report-section final-note">
        <p class="small-note">Version Ultra Premium V3 – ${config.brand.company}. Outil d'accompagnement non clinique. Lecture cognitive inspirée MBTI conservée à des fins de travail pédagogique. Préférence motrice à confirmer par observation terrain.</p>
      </section>
    `;

    const canvas = document.getElementById('reportRadar');
    if(window.PMPRadar) window.PMPRadar.render(canvas, report.scores, config);
  }
};