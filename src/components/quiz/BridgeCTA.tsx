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
      dvr: "eliminare definitivamente il rischio sospensione e proteggere la tua azienda da denunce penali",
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
    <div className="bg-black text-white rounded-lg p-6 text-center shadow-xl border-2 border-gray-800">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        {getBridgeQuestion()}
      </h2>
      <div className="flex justify-center">
        <div className="text-2xl animate-bounce">↓</div>
      </div>
    </div>
  );
};