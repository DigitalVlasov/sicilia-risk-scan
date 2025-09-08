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
      return "Vuoi verificare se il tuo sistema è davvero ottimale?";
    }
    
    if (violations.length >= 3) {
      return "Vuoi mettere fine a queste criticità una volta per tutte?";
    }
    
    if (violations.length >= 2) {
      return "Vuoi trasformare questi rischi in sicurezza garantita?";
    }
    
    return "Vuoi eliminare definitivamente questo rischio?";
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