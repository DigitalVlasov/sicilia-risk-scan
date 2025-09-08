import React from "react";
import { Risk, Violation, QuizAnswers } from "../../types";

interface BridgeCTAProps {
  risk: Risk;
  violations: Violation[];
  answers: QuizAnswers;
}

export const BridgeCTA: React.FC<BridgeCTAProps> = ({ risk, violations, answers }) => {
  const getBridgeQuestion = () => {
    if (violations.length === 0) {
      return "La tua azienda è già ben strutturata. Vuoi verificare se esistono margini per ottimizzare ulteriormente?";
    }
    
    if (violations.length >= 3) {
      return `Hai visto i risultati dei nostri clienti. Vuoi trasformare le tue ${violations.length} criticità in conformità totale?`;
    }
    
    if (violations.length >= 2) {
      return `Come i nostri clienti, anche tu puoi eliminare queste ${violations.length} criticità. Vuoi scoprire come?`;
    }
    
    return `Come per i casi che hai appena visto, possiamo risolvere definitivamente questa criticità. Vuoi sapere come?`;
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