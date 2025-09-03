import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Risk, Violation, QuizAnswers } from "../../types";
import { InsightBox } from "./InsightBox";
import { CaseStudyCarousel } from "./CaseStudyCarousel";
import { ContactCTA } from "./ContactCTA";
import { 
  generateDynamicInsight, 
  calculateSanctionDetails,
  riskBadgeVariant 
} from "../../utils/quiz-helpers";
import { UNIFIED_STYLES, DESIGN_TOKENS } from "../../constants/design-tokens";

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
    <section aria-labelledby="results-title" className={UNIFIED_STYLES.sectionSpacing}>
      {/* Primary Risk Card - Highest Visual Hierarchy */}
      <Card className={UNIFIED_STYLES.cardPrimary}>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">
            <Badge variant={riskBadgeVariant(risk.level)} className="mb-3 sm:mb-4 text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2">
              Rischio {risk.level}
            </Badge>
          </div>
          
          {violations.length > 0 ? (
              <div className="mt-4 sm:mt-6">
                <div className={`${UNIFIED_STYLES.contentBlockAccent} text-center`}>
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
                  <div className={`${UNIFIED_STYLES.contentBlock} text-left text-xs sm:text-sm mt-3`}>
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
            <div className={`${UNIFIED_STYLES.contentBlockSuccess} text-center mt-4 sm:mt-6`}>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">🎯 COMPLIMENTI!</div>
              <div className="text-sm sm:text-base text-green-800 font-semibold">
                Sulla base delle tue risposte, la tua azienda appare conforme ai controlli ispettivi più frequenti.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Personalized Insight Box - Primary Level */}
      <InsightBox insight={dynamicInsight} ctaTarget="#vantaggi-completi" />
      
      {/* Violations Detail Card - Secondary Level */}
      {violations.length > 0 && (
        <Card className={UNIFIED_STYLES.cardSecondary}>
          <CardHeader className="pb-2 sm:pb-4 border-b border-gray-100">
            <CardTitle className={UNIFIED_STYLES.titlePrimary}>Dettaglio Rischi e Soluzioni</CardTitle>
            <p className={`${UNIFIED_STYLES.captionText} mt-1`}>(clicca sulle opzioni per approfondire)</p>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6">
            {violations.map((v, index) => (
              <details key={v.key} className={`group ${UNIFIED_STYLES.contentBlock} overflow-hidden hover:bg-gray-50`}>
                <summary className={`cursor-pointer flex justify-between items-center hover:bg-white/50 ${DESIGN_TOKENS.animation.transition} -m-3 sm:-m-4 p-3 sm:p-4`}>
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
                <div className="border-t border-gray-100 bg-white/50 -m-3 sm:-m-4 mt-2 p-3 sm:p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className={`${UNIFIED_STYLES.contentBlockAccent} border-l-2 border-red-400`}>
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
                    <div className={`${UNIFIED_STYLES.contentBlockSuccess} border-l-2 border-green-400`}>
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
      
      {/* Solutions Card - Premium Dark Theme - Show for all scenarios */}
      {dynamicInsight.benefits && dynamicInsight.benefits.length > 0 && (
        <Card id="vantaggi-completi" className={UNIFIED_STYLES.cardDark}>
          <CardHeader className="border-b border-gray-600/30">
            <CardTitle className="text-lg sm:text-xl font-bold text-white">Come possiamo aiutarti - Sistema Spazio Impresa</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid gap-3 sm:gap-4">
              {dynamicInsight.benefits.map((benefit, index) => (
                <div key={index} className={`flex items-start gap-3 p-3 bg-white/5 ${DESIGN_TOKENS.radius.md} backdrop-blur-sm hover:bg-white/10 ${DESIGN_TOKENS.animation.transition} border border-white/10`}>
                  <span className="text-lg sm:text-xl">•</span>
                  <span className="text-sm sm:text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Features Card - Secondary Level */}
      <Card className={UNIFIED_STYLES.cardSecondary}>
        <CardHeader className="border-b border-gray-100">
          <CardTitle className={UNIFIED_STYLES.titlePrimary}>Cosa include il Sistema Organizzativo di Spazio Impresa:</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ul className={`space-y-2 ${UNIFIED_STYLES.bodyText}`}>
            <li className="flex items-start"><span className="text-blue-500 mr-2">✔</span><span>Gestione scadenze visite mediche e attestati di formazione</span></li>
            <li className="flex items-start"><span className="text-blue-500 mr-2">✔</span><span>Archivio documentale digitale 24/7</span></li>
            <li className="flex items-start"><span className="text-blue-500 mr-2">✔</span><span>Alert automatici personalizzati</span></li>
            <li className="flex items-start"><span className="text-blue-500 mr-2">✔</span><span>Supporto in caso di controlli ispettivi</span></li>
            <li className="flex items-start"><span className="text-blue-500 mr-2">✔</span><span>Erogazione corsi tramite i Fondi Interprofessionali</span></li>
          </ul>
        </CardContent>
      </Card>
      
      <ContactCTA risk={risk} sector={answers.settore} />
      
      {/* Case Studies Carousel - Moved to bottom */}
      <CaseStudyCarousel />
      
      <div className="text-center mt-6">
        <Button variant="ghost" onClick={onReset}>
          Rifai il test per un'altra azienda
        </Button>
      </div>
    </section>
  );
};