import React, { useMemo } from "react";
import { filterQuestions, calculateRisk, calculateViolations } from "../../utils/quiz-helpers";
import { useQuizState } from "../../hooks/useQuizState";
import { QuizStage } from "./QuizStage";
import { LoadingStage } from "./LoadingStage";
import { Results } from "./Results";
import { IntroStage } from "./IntroStage";
import { APP_CONFIG } from "../../constants/quiz-config";

export const QuizContainer: React.FC = () => {
  const filteredQuestions = useMemo(() => filterQuestions({}), []);
  const { state, handleStart, handleGoBack, handleReset, handleSelectOption } = useQuizState(filteredQuestions);
  
  const { stage, currentQuestionIndex, answers, baseScore, multiplier } = state;
  
  // Recalculate filtered questions based on current answers
  const currentFilteredQuestions = useMemo(() => filterQuestions(answers), [answers]);
  const currentQuestion = currentFilteredQuestions[currentQuestionIndex];
  
  const risk = useMemo(() => calculateRisk(baseScore, multiplier), [baseScore, multiplier]);
  const violations = useMemo(() => calculateViolations(answers), [answers]);
  
  const totalQuestionsForDisplay = useMemo(() => {
    if (answers.settore) {
      return currentFilteredQuestions.length;
    }
    return 10; // Default for better initial UX
  }, [answers.settore, currentFilteredQuestions.length]);

  const renderStage = () => {
    switch (stage) {
      case "quiz":
        return (
          <QuizStage
            question={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestionsForDisplay}
            answers={answers}
            onSelectOption={handleSelectOption}
            onGoBack={handleGoBack}
          />
        );
      case "loading":
        return <LoadingStage />;
      case "results":
        return (
          <Results
            risk={risk}
            violations={violations}
            answers={answers}
            onReset={handleReset}
          />
        );
      case "intro":
      default:
        return <IntroStage onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-2 text-center text-xs z-50">
        {APP_CONFIG.legal.disclaimer}
      </div>
      <main className="container mx-auto max-w-3xl px-4 py-6 sm:py-8 pb-16">
        {renderStage()}
      </main>
    </div>
  );
};