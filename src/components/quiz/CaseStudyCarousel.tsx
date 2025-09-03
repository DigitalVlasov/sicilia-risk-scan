import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CaseStudy } from "../../types";
import { CASE_STUDIES } from "../../constants/quiz-config";
import { UNIFIED_STYLES, DESIGN_TOKENS } from "../../constants/design-tokens";

export const CaseStudyCarousel: React.FC = () => {
  const [currentCaseStudy, setCurrentCaseStudy] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCaseStudy((prev) => (prev + 1) % CASE_STUDIES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card className={UNIFIED_STYLES.cardSecondary}>
      <CardHeader className="border-b border-gray-100">
        <CardTitle className={UNIFIED_STYLES.titlePrimary}>
          Casi di successo
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className={`flex ${DESIGN_TOKENS.animation.transition} ${DESIGN_TOKENS.animation.slow} ease-in-out`}
              style={{ transform: `translateX(-${currentCaseStudy * 100}%)` }}
            >
              {CASE_STUDIES.map((study, idx) => (
                <div key={idx} className="w-full flex-shrink-0 px-2">
                  <div className={`${UNIFIED_STYLES.contentBlock} hover:bg-gray-50/80`}>
                    <div className="mb-4 sm:mb-5">
                      <h3 className={`${UNIFIED_STYLES.titleSecondary} mb-2`}>
                        {study.title}
                      </h3>
                      <div className={`inline-flex items-center px-3 py-1 ${DESIGN_TOKENS.radius.full} bg-red-50/80 border border-red-200`}>
                        <span className="text-sm font-medium text-red-600">
                          {study.situation}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className={`${UNIFIED_STYLES.contentBlock} bg-white`}>
                        <h4 className="font-semibold text-red-600 text-sm mb-2">SFIDA</h4>
                        <p className="text-sm sm:text-base text-gray-700">
                          {study.challenge}
                        </p>
                      </div>
                      
                      <div className={`${UNIFIED_STYLES.contentBlock} bg-white`}>
                        <h4 className="font-semibold text-black text-sm mb-2">SOLUZIONE</h4>
                        <p className="text-sm sm:text-base text-gray-700">
                          {study.solution}
                        </p>
                      </div>
                      
                      <div className={`bg-gradient-to-br from-red-600 to-red-700 ${DESIGN_TOKENS.radius.md} p-3 sm:p-4 border border-red-500`}>
                        <h4 className="font-semibold text-white text-sm mb-2">RISULTATO</h4>
                        <p className="text-sm sm:text-base font-medium text-white">
                          {study.result}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* User-controlled navigation */}
          <div className="flex justify-center gap-3 mt-6">
            {CASE_STUDIES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentCaseStudy(idx)}
                className={`${DESIGN_TOKENS.animation.transition} ${DESIGN_TOKENS.animation.normal} rounded-full border-2 ${
                  currentCaseStudy === idx 
                    ? "w-10 h-4 bg-gradient-to-r from-red-600 to-black border-red-600 shadow-lg" 
                    : "w-4 h-4 bg-white border-gray-400 hover:border-red-400 hover:bg-red-50"
                }`}
                aria-label={`Vai al caso studio ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};