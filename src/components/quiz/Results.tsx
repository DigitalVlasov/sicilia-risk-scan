import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Risk, Violation, QuizAnswers } from "../../types";
import { InsightBox } from "./InsightBox";
import { CaseStudyCarousel } from "./CaseStudyCarousel";
import { ContactCTA } from "./ContactCTA";
import { FAQ } from "./FAQ";
import { 
  generateDynamicInsight, 
  calculateSanctionDetails,
  riskBadgeVariant 
} from "../../utils/quiz-helpers";
import { UNIFIED_STYLES } from "../../constants/design-tokens";

interface ResultsProps {
  risk: Risk;
  violations: Violation[];
  answers: QuizAnswers;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ risk, violations, answers, onReset }) => {
  const [showCalculation, setShowCalculation] = useState(false);
  
  const sanctionMax = violations.reduce((total, v) => total + v.max, 0);
  const sanctionDetails = useMemo(() => calculateSanctionDetails(answers, violations), [answers, violations]);
  const dynamicInsight = useMemo(() => generateDynamicInsight(answers, violations), [answers, violations]);

  const getCriticitaText = (count: number) => {
    return count === 1 ? `${count} criticità rilevata` : `${count} criticità rilevate`;
  };

  return (
    <section aria-labelledby="results-title" className="space-y-4 sm:space-y-6">
      {/* Primary Risk Card - Highest Visual Hierarchy */}
      <Card className="border-2 border-red-600 shadow-xl bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">
            <Badge variant={riskBadgeVariant(risk.level)} className="mb-3 sm:mb-4 text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2">
              Rischio {risk.level}
            </Badge>
          </div>
          
          {violations.length > 0 ? (
            <div className="mt-4 sm:mt-6">
              <div className="rounded-lg border-2 border-black bg-white p-4 sm:p-6 text-center shadow-inner">
                <div className="text-3xl sm:text-5xl font-black text-red-600 mb-2 sm:mb-3">
                  €{sanctionMax.toLocaleString("it-IT")}
                </div>
                <div className="text-sm sm:text-base text-black font-semibold">
                  È la sanzione massima che rischi OGGI se l'ispettore suona il campanello.
                </div>
                <button 
                  onClick={() => setShowCalculation(!showCalculation)} 
                  className="mt-3 text-xs sm:text-sm text-gray-600 hover:text-black font-medium flex items-center justify-center gap-1 mx-auto transition-colors"
                >
                  <span>Come abbiamo ottenuto questa cifra?</span>
                  <span className={`transition-transform ${showCalculation ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showCalculation && (
                  <div className="mt-3 p-3 bg-gray-50 rounded border text-left text-xs sm:text-sm">
                    <h4 className="font-bold mb-2">📊 Base di calcolo:</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• <strong>{getCriticitaText(sanctionDetails.violations)}</strong> su {sanctionDetails.totalAnswered} controlli verificati per il tuo settore</li>
                    </ul>
                    {sanctionDetails.sanctionBreakdown.length > 0 && (
                      <>
                        <h4 className="font-bold mt-3 mb-2">💰 Dettaglio sanzioni:</h4>
                        <ul className="space-y-1">
                          {sanctionDetails.sanctionBreakdown.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>{item.name}:</span>
                              <span className="font-semibold">fino a € {item.max.toLocaleString('it-IT')}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    <p className="mt-3 text-xs text-gray-600">
                      * Sanzioni cumulative secondo D.Lgs. 81/08, rivalutate +15,9% dal 06/10/2023
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4 sm:mt-6 rounded-lg border-2 border-green-500 bg-green-50 p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">🎯 COMPLIMENTI!</div>
              <div className="text-sm sm:text-base text-green-800 font-semibold">
                Sulla base delle tue risposte, la tua azienda appare conforme ai controlli ispettivi più frequenti.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Violations Detail Card - Secondary Level - Right after Hero */}
      {violations.length > 0 && (
        <Card className="border border-gray-300 shadow-lg bg-white">
          <CardHeader className="pb-2 sm:pb-4 border-b border-gray-200">
            <CardTitle className="text-lg sm:text-xl font-bold text-black">Dettaglio Rischi e Soluzioni</CardTitle>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">(clicca sulle opzioni per approfondire)</p>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6">
            {violations.map((v, index) => (
              <details key={v.key} className="group bg-gray-50 rounded-lg border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                <summary className="p-3 sm:p-4 cursor-pointer flex justify-between items-center hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-sm sm:text-base truncate whitespace-nowrap overflow-hidden text-ellipsis">{v.text}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="destructive" className="text-xs whitespace-nowrap">{v.priority.urgency}</Badge>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
                  </div>
                </summary>
                <div className="p-3 sm:p-4 border-t bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                      <h4 className="font-bold text-sm mb-2">⚠️ Rischi</h4>
                      <ul className="text-xs sm:text-sm space-y-1">
                        {v.consequences.map((c, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-red-500 mr-1">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                      <h4 className="font-bold text-sm mb-2">✅ Azioni</h4>
                      <ul className="text-xs sm:text-sm space-y-1">
                        {v.actions.map((a, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-500 mr-1">•</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 pt-2 mt-3 border-t">
                    <strong>📖 Normativa:</strong> {v.fonte}
                  </div>
                </div>
              </details>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Personalized Insight Box - After Violations Detail */}
      <InsightBox insight={dynamicInsight} ctaTarget="#vantaggi-completi" />
      
      {/* How it works section - Between insight and benefits */}
      {violations.length > 0 && (
        <Card className="border border-gray-300 shadow-lg bg-white">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-lg sm:text-xl font-bold text-black">Come funziona in pratica (3 step)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-black mb-1">Analisi e configurazione iniziale</h4>
                  <p className="text-sm text-gray-600">Configuriamo il sistema in base alle tue esigenze specifiche entro 48h dall'attivazione</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-black mb-1">Implementazione e formazione</h4>
                  <p className="text-sm text-gray-600">Ti formiamo sull'utilizzo e integriamo il sistema con i tuoi processi attuali</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-black mb-1">Supporto continuo</h4>
                  <p className="text-sm text-gray-600">Assistenza costante e aggiornamenti automatici per garantire sempre la conformità</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solutions Card - Premium Dark Theme - Show for all scenarios */}
      {dynamicInsight.benefits && dynamicInsight.benefits.length > 0 && (
        <Card id="vantaggi-completi" className="border-2 border-black shadow-xl bg-gradient-to-br from-gray-900 to-black text-white">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-lg sm:text-xl font-bold text-white">Cosa ottieni con il Sistema Organizzativo di Spazio Impresa</CardTitle>
            {violations.length > 0 && (
              <p className="text-sm text-gray-300 mt-2">
                Cosa ottieni dopo l'attivazione del servizio:
              </p>
            )}
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid gap-3 sm:gap-4">
              {dynamicInsight.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors border border-white/20">
                  <span className="text-lg sm:text-xl">•</span>
                  <span className="text-sm sm:text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <ContactCTA risk={risk} sector={answers.settore} />
      
      {/* Case Studies Carousel */}
      <CaseStudyCarousel />
      
      {/* FAQ Section */}
      <FAQ />
      
      <div className="text-center mt-6">
        <Button variant="ghost" onClick={onReset}>
          Rifai il test per un'altra azienda
        </Button>
      </div>
    </section>
  );
};