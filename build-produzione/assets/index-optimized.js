// Quiz Sicurezza Aziendale - Spazio Impresa
// Production build - Optimized JavaScript

(function() {
  'use strict';
  
  // App configuration
  const APP_CONFIG = {
    legal: {
      disclaimer: "Quiz a scopo informativo. Non sostituisce consulenza legale professionale.",
      source: "benchmark di conformità normativa"
    }
  };

  // Quiz data structure
  const QUESTIONS = [
    {
      id: "settore",
      title: "In che settore opera la tua azienda?",
      type: "select",
      options: [
        { label: "Industria manifatturiera", value: "manifatturiera", weight: 0 },
        { label: "Commercio", value: "commercio", weight: 0 },
        { label: "Servizi", value: "servizi", weight: 0 },
        { label: "Costruzioni/Edilizia", value: "costruzioni", weight: 0 },
        { label: "Trasporti e logistica", value: "trasporti", weight: 0 },
        { label: "Agricoltura", value: "agricoltura", weight: 0 },
        { label: "Altro", value: "altro", weight: 0 }
      ]
    },
    {
      id: "dipendenti",
      title: "Quanti dipendenti ha la tua azienda?",
      options: [
        { label: "1-5 dipendenti", value: "1-5", weight: 0 },
        { label: "6-15 dipendenti", value: "6-15", weight: 0 },
        { label: "16-50 dipendenti", value: "16-50", weight: 0 },
        { label: "Oltre 50 dipendenti", value: "50+", weight: 0 }
      ]
    },
    {
      id: "dvr",
      title: "Il Documento di Valutazione dei Rischi (DVR) della tua azienda è:",
      options: [
        { label: "Aggiornato e completo", value: "aggiornato", weight: 0, details: "Perfetto! Il DVR è la base della sicurezza aziendale." },
        { label: "Presente ma da aggiornare", value: "da_aggiornare", weight: 25, sanction: "€2.315 - €7.631", details: "Art. 29 D.Lgs. 81/08 - Il DVR deve essere aggiornato in caso di modifiche del processo produttivo o a seguito di infortuni." },
        { label: "Non presente o incompleto", value: "assente", weight: 50, sanction: "€2.315 - €7.631 + sospensione attività", details: "Art. 55 D.Lgs. 81/08 - La mancanza del DVR comporta sanzione penale e sospensione dell'attività imprenditoriale." }
      ]
    },
    {
      id: "formazione",
      title: "La formazione sulla sicurezza per i tuoi dipendenti è:",
      options: [
        { label: "Completa e aggiornata per tutti", value: "completa", weight: 0 },
        { label: "Parziale o da aggiornare", value: "parziale", weight: 20, sanction: "€1.315 - €5.699", details: "Art. 37 D.Lgs. 81/08 - Formazione obbligatoria per tutti i lavoratori." },
        { label: "Assente o insufficiente", value: "assente", weight: 40, sanction: "€1.315 - €5.699 + responsabilità penale", details: "La mancata formazione espone il datore di lavoro a responsabilità penale in caso di infortuni." }
      ]
    },
    {
      id: "rls",
      title: "Hai nominato il Rappresentante dei Lavoratori per la Sicurezza (RLS)?",
      options: [
        { label: "Sì, è nominato e formato", value: "si_formato", weight: 0 },
        { label: "Nominato ma non formato", value: "si_non_formato", weight: 15, sanction: "€2.315 - €7.631" },
        { label: "Non nominato", value: "no", weight: 25, sanction: "€2.315 - €7.631", details: "Art. 47 D.Lgs. 81/08 - Il RLS è obbligatorio in tutte le aziende con dipendenti." }
      ]
    },
    {
      id: "sorveglianza",
      title: "I tuoi dipendenti effettuano la sorveglianza sanitaria quando richiesta?",
      options: [
        { label: "Sì, regolarmente", value: "si", weight: 0 },
        { label: "Solo occasionalmente", value: "occasionale", weight: 20, sanction: "€1.096 - €4.384" },
        { label: "No, mai", value: "no", weight: 30, sanction: "€1.096 - €4.384", details: "Art. 41 D.Lgs. 81/08 - Sorveglianza sanitaria obbligatoria per mansioni a rischio." }
      ]
    }
  ];

  // Risk calculation
  const RISK_LEVELS = {
    LOW: { min: 0, max: 30, label: "BASSO", color: "green" },
    MEDIUM: { min: 31, max: 60, label: "MEDIO", color: "yellow" },
    HIGH: { min: 61, max: 100, label: "ALTO", color: "red" }
  };

  // Violation configurations
  const VIOLATIONS = {
    dvr: {
      key: "dvr",
      title: "DVR non conforme",
      description: "Documento di Valutazione Rischi assente o non aggiornato",
      sanction: "€2.315 - €7.631 + sospensione attività",
      priority: 1
    },
    formazione: {
      key: "formazione", 
      title: "Formazione insufficiente",
      description: "Formazione sicurezza carente o assente",
      sanction: "€1.315 - €5.699",
      priority: 2
    },
    sorveglianza: {
      key: "sorveglianza",
      title: "Sorveglianza sanitaria",
      description: "Controlli sanitari non effettuati",
      sanction: "€1.096 - €4.384",
      priority: 3
    },
    rls: {
      key: "rls",
      title: "RLS non nominato/formato",
      description: "Rappresentante Lavoratori Sicurezza mancante",
      sanction: "€2.315 - €7.631",
      priority: 4
    }
  };

  // App state
  let appState = {
    stage: 'intro',
    currentQuestion: 0,
    answers: {},
    score: 0
  };

  // DOM utilities
  function createElement(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.innerHTML = content;
    return el;
  }

  function clearContainer() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';
  }

  // Quiz logic
  function calculateRisk(answers) {
    let totalScore = 0;
    let maxPossibleScore = 0;

    QUESTIONS.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          totalScore += option.weight;
        }
      }
      // Calculate max possible weight for this question
      const maxWeight = Math.max(...question.options.map(opt => opt.weight));
      maxPossibleScore += maxWeight;
    });

    const riskScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
    
    let riskLevel;
    if (riskScore <= RISK_LEVELS.LOW.max) riskLevel = RISK_LEVELS.LOW;
    else if (riskScore <= RISK_LEVELS.MEDIUM.max) riskLevel = RISK_LEVELS.MEDIUM;
    else riskLevel = RISK_LEVELS.HIGH;

    return {
      score: Math.round(riskScore),
      level: riskLevel.label,
      color: riskLevel.color
    };
  }

  function calculateViolations(answers) {
    const violations = [];

    // Check DVR violation
    if (answers.dvr && (answers.dvr === 'da_aggiornare' || answers.dvr === 'assente')) {
      violations.push(VIOLATIONS.dvr);
    }

    // Check formazione violation
    if (answers.formazione && (answers.formazione === 'parziale' || answers.formazione === 'assente')) {
      violations.push(VIOLATIONS.formazione);
    }

    // Check sorveglianza violation
    if (answers.sorveglianza && (answers.sorveglianza === 'occasionale' || answers.sorveglianza === 'no')) {
      violations.push(VIOLATIONS.sorveglianza);
    }

    // Check RLS violation
    if (answers.rls && (answers.rls === 'si_non_formato' || answers.rls === 'no')) {
      violations.push(VIOLATIONS.rls);
    }

    return violations.sort((a, b) => a.priority - b.priority);
  }

  // Stage renderers
  function renderIntro() {
    clearContainer();
    const container = document.getElementById('quiz-container');
    
    container.innerHTML = `
      <div class="card-elevated animate-enter">
        <div class="text-center p-8">
          <h1 class="title-primary mb-6">Quiz Sicurezza Aziendale 2025</h1>
          <div class="mb-6">
            <img src="assets/spazio-impresa-logo.png" alt="Spazio Impresa Logo" class="mx-auto h-16 w-auto mb-4">
          </div>
          <p class="body-text mb-8">
            Scopri in 3 minuti il <strong>rischio economico</strong> della tua PMI e ricevi un'analisi personalizzata 
            basata sui ${APP_CONFIG.legal.source}.
          </p>
          <div class="bg-gradient-subtle rounded-lg p-6 mb-8">
            <h3 class="font-semibold mb-4">✅ Cosa otterrai:</h3>
            <ul class="text-left space-y-2">
              <li>📊 Valutazione rischio personalizzata</li>
              <li>💰 Calcolo potenziali sanzioni</li>
              <li>🎯 Piano d'azione specifico</li>
              <li>📞 Consulenza gratuita con i nostri esperti</li>
            </ul>
          </div>
          <button onclick="startQuiz()" class="btn-primary">
            🚀 Inizia il Test (3 min)
          </button>
        </div>
      </div>
    `;
  }

  function renderQuestion() {
    clearContainer();
    const container = document.getElementById('quiz-container');
    const question = QUESTIONS[appState.currentQuestion];
    const progress = ((appState.currentQuestion + 1) / QUESTIONS.length) * 100;

    let optionsHTML = '';
    
    if (question.type === 'select') {
      optionsHTML = `
        <select onchange="selectAnswer(this.value)" class="select-input">
          <option value="">Seleziona una risposta</option>
          ${question.options.map(opt => 
            `<option value="${opt.value}">${opt.label}</option>`
          ).join('')}
        </select>
      `;
    } else {
      optionsHTML = question.options.map(opt => 
        `<button onclick="selectAnswer('${opt.value}')" class="btn-outline hover-scale mb-3">
          ${opt.label}
        </button>`
      ).join('');
    }

    container.innerHTML = `
      <div class="card-elevated animate-enter">
        <div class="p-6">
          <div class="mb-6">
            <div class="progress-bar" style="width: ${progress}%"></div>
            <div class="text-sm text-muted mt-2">${Math.round(progress)}% completato</div>
          </div>
          <div class="mb-4">
            <span class="text-muted">Domanda ${appState.currentQuestion + 1} di ${QUESTIONS.length}</span>
            <h2 class="title-secondary mt-2">${question.title}</h2>
          </div>
          <div class="space-y-3">
            ${optionsHTML}
          </div>
        </div>
      </div>
    `;
  }

  function renderLoading() {
    clearContainer();
    const container = document.getElementById('quiz-container');
    
    container.innerHTML = `
      <div class="card-elevated">
        <div class="p-8 text-center">
          <div class="spinner mx-auto mb-4"></div>
          <h2 class="title-secondary mb-4">Analisi in corso...</h2>
          <p class="body-text">
            Confrontiamo le tue risposte con i ${APP_CONFIG.legal.source}
          </p>
        </div>
      </div>
    `;
  }

  function renderResults() {
    clearContainer();
    const container = document.getElementById('quiz-container');
    
    const risk = calculateRisk(appState.answers);
    const violations = calculateViolations(appState.answers);
    
    let maxSanction = 0;
    violations.forEach(v => {
      const amounts = v.sanction.match(/€([\d.]+)/g);
      if (amounts) {
        amounts.forEach(amount => {
          const num = parseInt(amount.replace(/[€.]/g, ''));
          if (num > maxSanction) maxSanction = num;
        });
      }
    });

    const whatsappMessage = `Ciao! Ho completato il Quiz Sicurezza di Spazio Impresa.%0A%0ARisultati:%0A- Livello rischio: ${risk.level}%0A- Settore: ${appState.answers.settore || 'Non specificato'}%0A- Dipendenti: ${appState.answers.dipendenti || 'Non specificato'}%0A%0AVorrei una consulenza gratuita per migliorare la sicurezza aziendale.`;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Risk Summary -->
        <div class="card-elevated text-center p-8">
          <h1 class="title-primary mb-4">La tua valutazione è completa!</h1>
          <div class="risk-badge risk-${risk.color} mb-6">
            <div class="text-3xl font-bold">${risk.score}%</div>
            <div class="text-lg">Rischio ${risk.level}</div>
          </div>
          ${maxSanction > 0 ? `
            <div class="alert alert-warning mb-6">
              <strong>⚠️ Potenziali sanzioni fino a €${maxSanction.toLocaleString()}</strong>
            </div>
          ` : ''}
          <p class="body-text mb-6">
            ${violations.length > 0 ? 
              'Abbiamo identificato alcune aree di miglioramento per proteggere la tua azienda.' :
              'Ottimo! La tua azienda mostra un buon livello di conformità.'
            }
          </p>
          <a href="https://wa.me/393123456789?text=${whatsappMessage}" target="_blank" class="btn-primary">
            📱 Richiedi Consulenza Gratuita
          </a>
        </div>

        ${violations.length > 0 ? `
          <!-- Violations -->
          <div class="card-elevated p-6">
            <h2 class="title-secondary mb-4">🚨 Aree di Attenzione (${violations.length})</h2>
            <div class="space-y-4">
              ${violations.map(v => `
                <div class="violation-item">
                  <h3 class="font-semibold text-red-600">${v.title}</h3>
                  <p class="text-sm text-muted">${v.description}</p>
                  <div class="text-sm font-medium text-red-700">Sanzione: ${v.sanction}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Solutions -->
        <div class="card-elevated p-6">
          <h2 class="title-secondary mb-4">💡 Le Nostre Soluzioni</h2>
          <ul class="space-y-2 mb-6">
            <li>✅ Consulenza normativa specializzata</li>
            <li>✅ Gestione completa adempimenti</li>
            <li>✅ Formazione certificata</li>
            <li>✅ Supporto costante</li>
          </ul>
          <div class="text-center">
            <a href="tel:+393123456789" class="btn-outline mr-4">
              📞 Chiama Ora
            </a>
            <a href="https://wa.me/393123456789?text=${whatsappMessage}" target="_blank" class="btn-primary">
              💬 WhatsApp
            </a>
          </div>
        </div>

        <!-- Reset -->
        <div class="text-center">
          <button onclick="resetQuiz()" class="btn-ghost">
            🔄 Rifai il Test
          </button>
        </div>
      </div>
    `;
  }

  // Event handlers
  window.startQuiz = function() {
    appState.stage = 'quiz';
    appState.currentQuestion = 0;
    renderQuestion();
  };

  window.selectAnswer = function(value) {
    const question = QUESTIONS[appState.currentQuestion];
    appState.answers[question.id] = value;
    
    setTimeout(() => {
      if (appState.currentQuestion < QUESTIONS.length - 1) {
        appState.currentQuestion++;
        renderQuestion();
      } else {
        appState.stage = 'loading';
        renderLoading();
        setTimeout(() => {
          appState.stage = 'results';
          renderResults();
        }, 2000);
      }
    }, 300);
  };

  window.resetQuiz = function() {
    appState = {
      stage: 'intro',
      currentQuestion: 0,
      answers: {},
      score: 0
    };
    renderIntro();
    window.scrollTo(0, 0);
  };

  // Initialize app
  document.addEventListener('DOMContentLoaded', function() {
    renderIntro();
  });

})();