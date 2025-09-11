import React from "react";
import { Risk, Violation, QuizAnswers } from "../../types";

interface BridgeCTAProps {
  risk: Risk;
  violations: Violation[];
  answers: QuizAnswers;
}

export const BridgeCTA: React.FC<BridgeCTAProps> = ({ risk, violations, answers }) => {
  const getDynamicBenefit = () => {
    if (violations.length === 0) {
      return "ottimizzare la tua struttura già solida e diventare un esempio di eccellenza nel settore";
    }

    // Get the most critical violation (they are sorted by priority)
    const primaryViolation = violations[0];
    
    const benefitMap: Record<string, string> = {
      dvr: "eliminare il rischio sospensione e proteggere la tua azienda da potenziali denunce penali",
      formazione: "azzerare la responsabilità penale e rendere il tuo team perfettamente formato e operativo",
      sorveglianza: "garantire che tutti i dipendenti siano sempre idonei al lavoro senza rischi legali",
      figure_spp: "avere tutte le figure di sicurezza nominate e operative per una protezione totale",
      emergenze: "essere preparati a qualsiasi emergenza con procedure certificate e testate",
      gestione: "creare un sistema di sicurezza che funziona da solo e ti fa dormire sonni tranquilli"
    };

    return benefitMap[primaryViolation.key] || "trasformare le tue criticità in punti di forza competitivi";
  };

  const getBridgeQuestion = () => {
    const benefit = getDynamicBenefit();
    return `Vuoi anche tu questo tipo di risultati? Scopri come ${benefit}`;
  };

  return (
    <div className="bg-black text-white rounded p-4 text-center shadow-md border border-gray-700">
      <h2 className="text-sm sm:text-base font-semibold mb-3">
        {getBridgeQuestion()}
      </h2>
      <div className="flex justify-center">
        <div className="text-lg animate-bounce">↓</div>
      </div>
    </div>
  );
};