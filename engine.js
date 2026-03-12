window.PMPEngine = {
  normalizeDimension(questions, answers){
    const max = questions.length * 5;
    const total = questions.reduce((sum, q) => {
      let val = Number(answers[q.id] || 0);
      if(q.reverse) val = 6 - val;
      return sum + val;
    }, 0);
    return Math.round((total / max) * 100);
  },

  computeMbti(questions, answers){
    const axisScores = {ei:0, sn:0, tf:0, jp:0};
    questions.filter(q => q.type === 'binary').forEach(q => {
      const ans = answers[q.id];
      if(ans === 'A') axisScores[q.axis] += 1;
      if(ans === 'B') axisScores[q.axis] -= 1;
    });
    return {
      type: (axisScores.ei >= 0 ? 'E' : 'I') + (axisScores.sn >= 0 ? 'S' : 'N') + (axisScores.tf >= 0 ? 'T' : 'F') + (axisScores.jp >= 0 ? 'J' : 'P'),
      axisScores
    };
  },

  computeProfiles(scores, formulas){
    return Object.entries(formulas)
      .map(([name, dims]) => ({
        name,
        value: Math.round(dims.reduce((s,d) => s + scores[d], 0) / dims.length)
      }))
      .sort((a,b) => b.value - a.value);
  },

  computeCoherence(scores, mbtiType, config){
    const motor = config.mbtiToMotor[mbtiType];
    if(!motor) return 50;
    let base = Math.round((scores.motricite + scores.cognition) / 2);
    if(['R','C'].includes(motor[0]) && scores.cognition >= 60) base += 8;
    if(['D','G'].includes(motor[0]) && scores.attention >= 60) base += 5;
    return Math.max(30, Math.min(96, base));
  },

  computeLearningStyle(scores){
    const options = [
      ['Analytique', Math.round((scores.cognition + scores.attention)/2)],
      ['Expérientiel', Math.round((scores.motricite + scores.activation)/2)],
      ['Compétitif', Math.round((scores.engagement + scores.activation)/2)],
      ['Méthodique', Math.round((scores.attention + scores.motricite)/2)]
    ].sort((a,b) => b[1] - a[1]);
    return options[0][0];
  },

  computeGlobalBand(globalIndex){
    if(globalIndex >= 80) return 'mental performant';
    if(globalIndex >= 65) return 'mental solide';
    if(globalIndex >= 50) return 'mental en développement';
    return 'mental fragile';
  },

  compute(questions, answers, athlete, config){
    const scores = {};
    Object.keys(config.dimensions).forEach(key => {
      const items = questions.filter(q => q.dimension === key);
      scores[key] = this.normalizeDimension(items, answers);
    });

    const mbti = this.computeMbti(questions, answers);
    const motor = config.mbtiToMotor[mbti.type] || '—';
    const motorFamily = motor !== '—' ? {D:'ST', G:'SF', R:'NF', C:'NT'}[motor[0]] : '—';

    const globalIndex = Math.round((
      scores.activation * 1 +
      scores.attention * 1.2 +
      scores.regulation * 1.3 +
      scores.engagement * 1 +
      scores.confiance * 1.2 +
      scores.resilience * 1 +
      scores.cognition * 0.9 +
      scores.motricite * 0.8
    ) / 8.4);

    const pressureIndex = Math.round(scores.regulation * 0.4 + scores.confiance * 0.3 + scores.resilience * 0.3);
    const stabilityIndex = Math.round((scores.regulation + scores.attention + scores.resilience) / 3);

    const profiles = this.computeProfiles(scores, config.profileFormulas);
    const learningStyle = this.computeLearningStyle(scores);
    const coherenceIndex = this.computeCoherence(scores, mbti.type, config);

    return {
      athlete,
      scores,
      profiles,
      globalIndex,
      globalBand: this.computeGlobalBand(globalIndex),
      pressureIndex,
      stabilityIndex,
      learningStyle,
      mbtiType: mbti.type,
      motor,
      motorFamily,
      coherenceIndex
    };
  }
};