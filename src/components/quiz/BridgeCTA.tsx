import React from "react";
import { Risk, Violation, QuizAnswers } from "../../types";
import { generateDynamicInsight } from "../../utils/quiz-helpers";

interface BridgeCTAProps {
  risk: Risk;
  violations: Violation[];
  answers: QuizAnswers;
}

export const BridgeCTA: React.FC<BridgeCTAProps> = ({ risk, violations, answers }) => {
  const insight = generateDynamicInsight(answers, violations);
  
  const getBridgeDiagnosis = () => {
    if (violations.length === 0) {
      return "La tua azienda è già ben strutturata dal punto di vista della sicurezza.";
    }
    
    const managementStyles = {
      "gestisco-io": "gestisci personalmente la sicurezza",
      "interno": "hai una risorsa interna dedicata",
      "consulente": "ti appoggi a un consulente esterno",
      "studi-multipli": "collabori con più professionisti"
    };
    
    const managementText = managementStyles[answers.gestione as keyof typeof managementStyles] || "gestisci la sicurezza";
    
    if (violations.length === 1) {
      return `Abbiamo rilevato 1 criticità. Pur ${managementText}, questa area di rischio può esporti a sanzioni.`;
    }
    
    return `Abbiamo rilevato ${violations.length} criticità. Pur ${managementText}, queste aree di rischio possono esporti a sanzioni significative.`;
  };
  
  const getBridgeQuestion = () => {
    if (violations.length === 0) {
      return "Vuoi verificare se esistono margini per ottimizzare ulteriormente i tuoi processi?";
    }
    
    return "Vuoi trasformare definitivamente queste criticità in conformità totale?";
  };
  
  const getTopBenefits = () => {
    if (!insight.benefits || insight.benefits.length === 0) return [];
    return insight.benefits.slice(0, 3); // Prime 3 benefits più impattanti
  };

  const topBenefits = getTopBenefits();

  return (
    <div className="bg-black text-white rounded-lg p-6 shadow-xl border-2 border-gray-800">
      {/* Diagnosi sintetica */}
      <div className="text-center mb-6">
        <p className="text-sm sm:text-base text-gray-300 mb-4">
          {getBridgeDiagnosis()}
        </p>
        
        {/* Benefici dinamici */}
        {topBenefits.length > 0 && (
          <div className="bg-white/10 rounded-lg p-4 mb-6 backdrop-blur-sm border border-white/20">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Con il nostro sistema ottieni:
            </h3>
            <div className="space-y-2">
              {topBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center justify-center gap-2 text-sm sm:text-base">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-200">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Domanda di conversione */}
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          {getBridgeQuestion()}
        </h2>
      </div>
      
      <div className="flex justify-center">
        <div className="text-2xl animate-bounce">↓</div>
      </div>
    </div>
  );
};