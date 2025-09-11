import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Risk, Violation, QuizAnswers } from "../../types";
import { InsightBox } from "./InsightBox";
import { CaseStudyCarousel } from "./CaseStudyCarousel";
import { ContactCTA } from "./ContactCTA";
import { BridgeCTA } from "./BridgeCTA";
import { ComparisonTable } from "./ComparisonTable";
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

  const getHeroMessage = () => {
    if (violations.length === 0) {
      return {
        title: "✅ COMPLIMENTI!",
        subtitle: "La tua azienda rispetta le norme di sicurezza",
        message: "Ma stai sfruttando tutte le opportunità per eccellere nel tuo settore?",
        ctaText: "🚀 ANALISI STRATEGICA GRATUITA",
        ctaSubtext: "Ottimizza per diventare un'eccellenza"
      };
    }

    // Get the most severe consequence from violations
    const mostSevereConsequence = violations
      .flatMap(v => v.consequences)
      .find(c => c.toLowerCase().includes('sospensione') || c.toLowerCase().includes('blocco')) ||
      violations.flatMap(v => v.consequences)
        .find(c => c.toLowerCase().includes('denuncia') || c.toLowerCase().includes('penale')) ||
      violations[0]?.consequences[0] || "possibili sanzioni amministrative";

    const consequenceText = mostSevereConsequence.toLowerCase().includes('sospensione') ? 
      "la sospensione dell'attività" :
      mostSevereConsequence.toLowerCase().includes('blocco') ?
      "il blocco dell'attività" :  
      mostSevereConsequence.toLowerCase().includes('denuncia') ?
      "possibili denunce penali" :
      "gravi conseguenze amministrative";

    const mainViolationType = violations[0]?.key;
    const violationContext = 
      mainViolationType === 'dvr' ? "gravi violazioni DVR" :
      mainViolationType === 'formazione' ? "violazioni formative" :
      mainViolationType === 'gestione' ? "violazioni gestionali" :
      "violazioni normative";

    const solutionText = 
      mainViolationType === 'dvr' ? "Elimina il rischio sospensione con un DVR completo" :
      mainViolationType === 'formazione' ? "Azzerare la responsabilità penale con formazione certificata" :
      mainViolationType === 'gestione' ? "Crea un sistema di sicurezza che funziona automaticamente" :
      "Metti in sicurezza la tua azienda prima del controllo";

    return {
      title: `⚠️ RISCHIO ${risk.level.toUpperCase()}`,
      subtitle: `Rischi fino a €${sanctionMax.toLocaleString("it-IT")} di sanzioni e ${consequenceText}`,
      message: `in caso di ispezione con ${violationContext}`,
      ctaText: "🎯 ANALISI GRATUITA - 15 MIN",
      ctaSubtext: risk.level === "Alto" ? "Metti subito in sicurezza la tua azienda" :
                   risk.level === "Medio" ? "Risolvi le criticità prima che sia tardi" :
                   "Completa la messa a norma definitiva"
    };
  };

  const heroData = getHeroMessage();

  return (
    <section aria-labelledby="results-title" className="space-y-4 sm:space-y-6">
      {/* Primary Risk Card - Dynamic Hero Section */}
      <Card className="border-2 border-red-600 shadow-xl bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">
            {/* Risk Badge - Oval shape with colors based on risk level */}
            {violations.length > 0 ? (
              <div className={`inline-flex items-center px-6 py-3 rounded-full mb-2 ${
                risk.level === 'Alto' ? 'bg-red-100 text-red-800 border-2 border-red-300' :
                risk.level === 'Medio' ? 'bg-orange-100 text-orange-800 border-2 border-orange-300' :
                'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
              }`}>
                <span className="font-bold text-sm sm:text-base">RISCHIO {risk.level.toUpperCase()}</span>
              </div>
            ) : (
              <div className="inline-flex items-center px-6 py-3 rounded-full mb-2 bg-green-100 text-green-800 border-2 border-green-300">
                <span className="font-bold text-sm sm:text-base">✅ COMPLIMENTI!</span>
              </div>
            )}
            
            {/* Small phrase below badge - only for violations scenarios */}
            {violations.length > 0 && (
              <div className="text-xs sm:text-sm text-gray-600 font-medium mb-4">
                {heroData.message}
              </div>
            )}
            
            {/* Main message with sanctions - less prominent */}
            <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
              {heroData.subtitle}
            </div>

            {/* Additional phrase for clean scenarios - after main message */}
            {violations.length === 0 && (
              <div className="text-sm sm:text-base text-gray-600 font-medium">
                {heroData.message}
              </div>
            )}
          </div>
          
          {violations.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <div className="rounded-lg border-2 border-black bg-white p-4 sm:p-6 text-center shadow-inner">
                <button 
                  onClick={() => setShowCalculation(!showCalculation)} 
                  className="text-xs sm:text-sm text-gray-600 hover:text-black font-medium flex items-center justify-center gap-1 mx-auto transition-colors"
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
          )}
        </CardContent>
      </Card>

      {/* Dynamic Insights Box - for clean scenarios */}
      {violations.length === 0 && <InsightBox insight={dynamicInsight} />}

      {/* CTA Section - Only for violations scenarios */}
      {violations.length > 0 && (
        <div className="bg-gray-800 text-white p-6 rounded-lg text-center">
          <p className="text-lg mb-4 font-medium">
            Non aspettare l'ispezione, risolviamo insieme ogni criticità. Prenota ora una consulenza gratuita.
          </p>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
            onClick={() => window.open('https://wa.me/393123456789?text=Ciao, ho fatto il test di sicurezza e vorrei parlare delle criticità emerse', '_blank')}
          >
            📱 Parliamone su WhatsApp
          </Button>
        </div>
      )}
      
      {/* Dynamic Insights Box - for violations scenarios */}
      {violations.length > 0 && <InsightBox insight={dynamicInsight} />}
      
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
                      ✕
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
      
      {/* Solutions Card - Premium Dark Theme - Show for all scenarios when benefits exist */}
      {dynamicInsight.benefits && dynamicInsight.benefits.length > 0 && (
        <Card id="vantaggi-completi" className="border-2 border-black shadow-xl bg-gradient-to-br from-gray-900 to-black text-white">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-lg sm:text-xl font-bold text-white">
              {violations.length > 0 
                ? "Cosa ottieni con il Sistema Organizzativo di Spazio Impresa" 
                : "Vantaggi dell'ottimizzazione con Spazio Impresa"}
            </CardTitle>
            <p className="text-sm text-gray-300 mt-2">
              {violations.length > 0 
                ? "(dopo l'attivazione del servizio)" 
                : "(mantenendo ciò che già funziona)"}
            </p>
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
      
      {/* Case Studies Carousel */}
      <CaseStudyCarousel />
      
      {/* Bridge CTA */}
      <BridgeCTA risk={risk} violations={violations} answers={answers} />
      
      
      <div id="contact-cta">
        <ContactCTA risk={risk} sector={answers.settore} answers={answers} />
      </div>
      
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