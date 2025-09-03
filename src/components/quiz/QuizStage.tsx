import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { QuizQuestion, QuizAnswers } from "../../types";
import { UNIFIED_STYLES, DESIGN_TOKENS } from "../../constants/design-tokens";

interface QuizStageProps {
  question?: QuizQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: QuizAnswers;
  onSelectOption: (question: QuizQuestion, option: any) => void;
  onGoBack: () => void;
}

export const QuizStage: React.FC<QuizStageProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  answers,
  onSelectOption,
  onGoBack
}) => {
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  
  return (
    <section aria-labelledby="quiz-title" className="space-y-4">
      <Card className={UNIFIED_STYLES.cardPrimary}>
        <CardContent className={`space-y-4 sm:space-y-6 ${DESIGN_TOKENS.padding.card}`}>
          <div>
            <div className="h-3 w-full rounded bg-gray-200 overflow-hidden">
              <div 
                className={`h-3 rounded bg-gradient-to-r from-red-600 to-red-800 ${DESIGN_TOKENS.animation.transition} ${DESIGN_TOKENS.animation.slow} ease-out`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className={`mt-2 text-center ${UNIFIED_STYLES.captionText}`}>
              Domanda {currentQuestionIndex + 1} di {totalQuestions}
            </p>
          </div>
          
          {question && (
            <div>
              <h2 className={UNIFIED_STYLES.titleSecondary}>
                {question.title}
              </h2>
              {question.subtitle && (
                <p className={`mt-1 ${UNIFIED_STYLES.captionText}`}>
                  {question.subtitle}
                </p>
              )}
              
              <div className="mt-4 grid gap-2 sm:gap-3">
                {question.options.map(opt => {
                  const selected = answers[question.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => onSelectOption(question, opt)}
                      className={`flex w-full items-center gap-3 rounded-md border-2 p-3 sm:p-4 text-left ${DESIGN_TOKENS.animation.transition} hover:shadow-md active:scale-[0.98] ${
                        selected 
                          ? "border-red-600 bg-red-50 shadow-md" 
                          : "border-gray-300 hover:border-red-400 hover:bg-red-50/50"
                      }`}
                    >
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-white ${DESIGN_TOKENS.animation.transition} ${
                        selected 
                          ? "border-red-600 bg-red-600 scale-110" 
                          : "border-gray-400"
                      }`}>
                        {selected && "✓"}
                      </div>
                      <span className={UNIFIED_STYLES.bodyText}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-start">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onGoBack} 
          disabled={currentQuestionIndex === 0}
        >
          ← Indietro
        </Button>
      </div>
    </section>
  );
};