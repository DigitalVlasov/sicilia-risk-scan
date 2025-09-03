import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { UNIFIED_STYLES, DESIGN_TOKENS } from "../../constants/design-tokens";
import { APP_CONFIG } from "../../constants/quiz-config";
interface IntroStageProps {
  onStart: () => void;
}
export const IntroStage: React.FC<IntroStageProps> = ({
  onStart
}) => {
  const [activeObjection, setActiveObjection] = useState(0);
  const objections = [{
    title: "È accurato?",
    icon: "🎯",
    content: `L'analisi è basata sui ${APP_CONFIG.legal.source}. Le domande replicano i controlli più frequenti. La metodologia è stata validata su oltre 800 verifiche reali in Sicilia.`
  }, {
    title: "Quanto tempo serve?",
    icon: "⏱️",
    content: "2 minuti per completare il test, risultati immediati. Ogni domanda è formulata per decisioni rapide basate su situazioni concrete. Non richiede consultazione di documenti."
  }, {
    title: "Cosa ottengo?",
    icon: "✅",
    content: "Analisi personalizzata per il tuo settore, identificazione delle priorità, stima realistica dei rischi e delle tempistiche. Tutto quello che serve per decidere i prossimi passi in modo informato."
  }];
  return <section aria-labelledby="intro-title">
      <div className="text-center py-5">
        <div className="w-20 h-20 bg-white border-2 border-red-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden mx-auto">
          <img src="/lovable-uploads/53e4bec6-be78-459e-a5a5-a2b8ae560a04.png" alt="Spazio Impresa Logo" className="w-full h-full object-contain p-1" />
        </div>
      </div>
      
      <Card className={`border-2 border-red-600 ${DESIGN_TOKENS.shadows["2xl"]}`}>
        <CardContent className={DESIGN_TOKENS.padding.card}>
          <h1 id="intro-title" className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-4 leading-tight">
            <span className="text-black">Se l'</span>
            <span className="text-red-600">Ispettore</span>
            <span className="text-black"> bussa domani?</span>
          </h1>
          
          <div className="text-center mb-4 sm:mb-6">
            <p className={`${UNIFIED_STYLES.titleSecondary} text-black mb-3`}>
              Sei pronto? O <span className="text-red-600">rischi multe e guai legali</span> come il 74% dei colleghi siciliani che si sentivano coperti?
            </p>
            
            <div className="text-center mb-3">
              <Button onClick={onStart} size="lg" className={`w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:scale-105 ${DESIGN_TOKENS.animation.transition} ${DESIGN_TOKENS.animation.normal}`}>
                SCOPRI ORA SE È TUTTO OK →
              </Button>
            </div>
            
            <div className="inline-block bg-yellow-400 text-black px-2 py-1 rounded text-[10px] font-semibold border border-black mb-2">
              ⚡ Analisi rapida basata su {APP_CONFIG.legal.source}
            </div>
            
            <p className="text-[10px] text-gray-600 font-medium">
              Risultati personalizzati per settore • Zero dati personali richiesti
            </p>
          </div>
          
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h2 className={`${UNIFIED_STYLES.titleSecondary} text-center mb-2 sm:mb-3 text-red-700`}>
              📊 Statistiche Ufficiali Sicilia
            </h2>
            <div className="text-center">
              <div className="bg-white p-3 rounded border mb-2">
                <div className="text-2xl font-black text-red-600">74%</div>
                <div className="text-sm font-medium text-black">
                  aziende siciliane presenta non conformità alla prima verifica
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-red-600 mt-2 font-medium">
              Fonte: Elaborazione su dati INL-SPRESAL 2024
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {objections.map((obj, idx) => <button key={idx} onClick={() => setActiveObjection(idx)} className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium ${DESIGN_TOKENS.animation.transition} ${activeObjection === idx ? "bg-yellow-400 text-black" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                  {obj.icon} {obj.title}
                </button>)}
            </div>
            <div className="bg-black text-white p-3 rounded">
              <div className="font-bold text-yellow-400 mb-2">
                {objections[activeObjection].icon} {objections[activeObjection].title}
              </div>
              <p className="text-sm">{objections[activeObjection].content}</p>
            </div>
          </div>
          
          <div className="text-center">
            <Button onClick={onStart} variant="outline" className="w-full sm:w-auto border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
              Fai il test ora (è gratis)
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>;
};