// Servizio centralizzato per il tracciamento eventi verso GTM
// Invia eventi alla pagina parent (WordPress) tramite postMessage

const sendEvent = (eventName: string, eventData: Record<string, unknown> = {}) => {
  try {
    window.parent.postMessage({
      type: 'quiz-tracking',
      event: eventName,
      data: {
        ...eventData,
        timestamp: new Date().toISOString()
      }
    }, '*');
  } catch (error) {
    console.warn('Tracking event failed:', eventName, error);
  }
};

export const trackingService = {
  // Quiz iniziato
  trackQuizStarted: () => {
    sendEvent('quiz_started');
  },

  // Risposta selezionata
  trackAnswer: (questionId: string, questionText: string, selectedAnswer: string, questionIndex: number) => {
    sendEvent('quiz_answer', {
      questionId,
      questionText,
      selectedAnswer,
      questionIndex
    });
  },

  // Fase di caricamento visualizzata
  trackLoading: () => {
    sendEvent('quiz_loading');
  },

  // Risultati visualizzati
  trackResultsViewed: (riskLevel: string, finalScore: number, violationsCount: number, maxSanction: number, sector: string, managementType: string) => {
    sendEvent('quiz_results_viewed', {
      riskLevel,
      finalScore,
      violationsCount,
      maxSanction,
      sector,
      managementType
    });
  },

  // Espansione dettaglio calcolo sanzioni
  trackCalculationExpanded: (riskLevel: string, maxSanction: number) => {
    sendEvent('quiz_calculation_expanded', {
      riskLevel,
      maxSanction
    });
  },

  // Dettaglio violazione visualizzato
  trackViolationDetailViewed: (violationKey: string, violationText: string, urgency: string) => {
    sendEvent('quiz_violation_detail_viewed', {
      violationKey,
      violationText,
      urgency
    });
  },

  // Click WhatsApp nel box hero
  trackWhatsAppHeroClick: (riskLevel: string, sector: string, violationsCount: number) => {
    sendEvent('quiz_whatsapp_hero_click', {
      riskLevel,
      sector,
      violationsCount
    });
  },

  // Click WhatsApp CTA finale
  trackWhatsAppCtaClick: (riskLevel: string, sector: string) => {
    sendEvent('quiz_whatsapp_cta_click', {
      riskLevel,
      sector
    });
  },

  // Click telefono
  trackPhoneCtaClick: (riskLevel: string, sector: string) => {
    sendEvent('quiz_phone_cta_click', {
      riskLevel,
      sector
    });
  },

  // Quiz resettato
  trackQuizReset: (previousRiskLevel: string) => {
    sendEvent('quiz_reset', {
      previousRiskLevel
    });
  }
};
