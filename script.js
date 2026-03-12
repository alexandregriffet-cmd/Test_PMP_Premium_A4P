(function(){
  const QUESTIONS = window.PMP_QUESTIONS;
  const CONFIG = window.PMP_CONFIG;
  const STORAGE_KEY = 'pmp_a4p_ultra_premium_progress';
  const HISTORY_KEY = 'pmp_a4p_ultra_premium_history';

  const state = {
    currentIndex: 0,
    answers: {},
    athlete: {},
    history: []
  };

  function qs(sel){ return document.querySelector(sel); }
  function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

  function showScreen(screenId){
    qsa('.screen').forEach(s => s.classList.remove('active'));
    qs(`#${screenId}`).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function getAthleteInput(){
    return {
      name: qs('#athleteName').value.trim() || 'Sportif A4P',
      age: qs('#athleteAge').value.trim() || '',
      sport: qs('#athleteSport').value.trim() || '',
      club: qs('#athleteClub').value.trim() || '',
      email: qs('#athleteEmail').value.trim() || ''
    };
  }

  function getBlockInfo(q){
    if(q.type === 'binary') return { title: 'Lecture cognitive', subtitle: 'Axes E/I – S/N – T/F – J/P' };
    return { title: CONFIG.dimensions[q.dimension].label, subtitle: CONFIG.dimensions[q.dimension].description };
  }

  function renderQuestion(){
    const q = QUESTIONS[state.currentIndex];
    const block = getBlockInfo(q);

    qs('#questionCounter').textContent = `Question ${state.currentIndex + 1} / ${QUESTIONS.length}`;
    qs('#blockTitle').textContent = block.title;
    qs('#blockSubtitle').textContent = block.subtitle;
    const progress = Math.round(((state.currentIndex + 1) / QUESTIONS.length) * 100);
    qs('#progressBar').style.width = `${progress}%`;
    qs('#progressLabel').textContent = `${progress}% terminé`;

    let html = '';
    if(q.type === 'likert'){
      html = `
        <div class="pill">${CONFIG.dimensions[q.dimension].label}</div>
        <h3 class="question-title">${q.text}</h3>
        <p class="muted">${CONFIG.dimensions[q.dimension].description}</p>
        <div class="answer-grid">
          ${[
            '1 — Pas du tout d\'accord',
            '2 — Plutôt pas d\'accord',
            '3 — Mitigé',
            '4 — Plutôt d\'accord',
            '5 — Tout à fait d\'accord'
          ].map((label, idx) => {
            const value = idx + 1;
            const selected = Number(state.answers[q.id]) === value ? 'selected' : '';
            return `<button class="answer-btn ${selected}" data-value="${value}">${label}</button>`;
          }).join('')}
        </div>
      `;
    } else {
      html = `
        <div class="pill">Lecture cognitive</div>
        <h3 class="question-title">${q.text}</h3>
        <p class="muted">Choisis l'affirmation qui te ressemble le plus.</p>
        <div class="binary-grid">
          <button class="answer-btn ${state.answers[q.id] === 'A' ? 'selected' : ''}" data-value="A"><strong>A</strong><span>${q.optionA}</span></button>
          <button class="answer-btn ${state.answers[q.id] === 'B' ? 'selected' : ''}" data-value="B"><strong>B</strong><span>${q.optionB}</span></button>
        </div>
      `;
    }

    qs('#questionCard').innerHTML = html;

    qsa('#questionCard .answer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.answers[q.id] = q.type === 'likert' ? Number(btn.dataset.value) : btn.dataset.value;
        persistProgress();
        renderQuestion();
      });
    });

    qs('#prevBtn').disabled = state.currentIndex === 0;
    qs('#nextBtn').textContent = state.currentIndex === QUESTIONS.length - 1 ? 'Voir le rapport' : 'Suivant';
  }

  function persistProgress(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentIndex: state.currentIndex,
      answers: state.answers,
      athlete: state.athlete
    }));
  }

  function loadProgress(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return false;
    try {
      const saved = JSON.parse(raw);
      state.currentIndex = saved.currentIndex || 0;
      state.answers = saved.answers || {};
      state.athlete = saved.athlete || {};
      return true;
    } catch(e){
      return false;
    }
  }

  function loadHistory(){
    try {
      state.history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch(e){
      state.history = [];
    }
  }

  function saveHistory(report){
    loadHistory();
    state.history.push({
      date: new Date().toLocaleDateString('fr-FR'),
      globalIndex: report.globalIndex,
      profile: report.profiles[0]?.name || '',
      mbtiType: report.mbtiType,
      motor: report.motor
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
  }

  function ensureAnswered(){
    const q = QUESTIONS[state.currentIndex];
    return state.answers[q.id] !== undefined && state.answers[q.id] !== null && state.answers[q.id] !== '';
  }

  function goNext(){
    if(!ensureAnswered()){
      alert("Merci de répondre avant de continuer.");
      return;
    }
    if(state.currentIndex === QUESTIONS.length - 1){
      generateReport();
      return;
    }
    state.currentIndex += 1;
    persistProgress();
    renderQuestion();
  }

  function goPrev(){
    if(state.currentIndex > 0){
      state.currentIndex -= 1;
      persistProgress();
      renderQuestion();
    }
  }

  function generateReport(){
    state.athlete = state.athlete.name ? state.athlete : getAthleteInput();
    const report = window.PMPEngine.compute(QUESTIONS, state.answers, state.athlete, CONFIG);
    saveHistory(report);
    loadHistory();
    window.PMPReport.render(qs('#reportContent'), report, state);
    showScreen('screen-report');
  }

  function startTest(demo=false){
    state.athlete = getAthleteInput();
    if(demo){
      QUESTIONS.forEach((q, i) => {
        state.answers[q.id] = q.type === 'likert' ? [4,5,3,4,5][i % 5] : (i % 2 === 0 ? 'A' : 'B');
      });
      generateReport();
      return;
    }
    state.currentIndex = 0;
    state.answers = {};
    persistProgress();
    showScreen('screen-test');
    renderQuestion();
  }

  function resumeTest(){
    if(!loadProgress()){
      alert("Aucune sauvegarde trouvée.");
      return;
    }
    showScreen('screen-test');
    renderQuestion();
  }

  function exportJSON(){
    const report = window.PMPEngine.compute(QUESTIONS, state.answers, state.athlete, CONFIG);
    const blob = new Blob([JSON.stringify(report, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rapport_pmp_a4p_ultra_premium.json';
    a.click();
  }

  function clearAll(){
    localStorage.removeItem(STORAGE_KEY);
    state.currentIndex = 0;
    state.answers = {};
    state.athlete = {};
    showScreen('screen-intro');
  }

  function hydrateIntroFields(){
    if(state.athlete.name) qs('#athleteName').value = state.athlete.name || '';
    if(state.athlete.age) qs('#athleteAge').value = state.athlete.age || '';
    if(state.athlete.sport) qs('#athleteSport').value = state.athlete.sport || '';
    if(state.athlete.club) qs('#athleteClub').value = state.athlete.club || '';
    if(state.athlete.email) qs('#athleteEmail').value = state.athlete.email || '';
  }

  qs('#startBtn').addEventListener('click', () => startTest(false));
  qs('#demoBtn').addEventListener('click', () => startTest(true));
  qs('#resumeBtn').addEventListener('click', resumeTest);
  qs('#saveBtn').addEventListener('click', () => { state.athlete = getAthleteInput(); persistProgress(); alert("Progression sauvegardée dans ce navigateur."); });
  qs('#nextBtn').addEventListener('click', goNext);
  qs('#prevBtn').addEventListener('click', goPrev);
  qs('#printBtn').addEventListener('click', () => window.print());
  qs('#jsonBtn').addEventListener('click', exportJSON);
  qs('#restartBtn').addEventListener('click', clearAll);
  qs('#backHomeBtn').addEventListener('click', () => showScreen('screen-intro'));

  loadProgress();
  loadHistory();
  hydrateIntroFields();
})();