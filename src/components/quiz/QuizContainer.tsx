import React, { useMemo, useEffect } from "react";
import { filterQuestions, calculateRisk, calculateViolations } from "../../utils/quiz-helpers";
import { useQuizState } from "../../hooks/useQuizState";
import { QuizStage } from "./QuizStage";
import { LoadingStage } from "./LoadingStage";
import { Results } from "./Results";
import { IntroStage } from "./IntroStage";
import { APP_CONFIG } from "../../constants/quiz-config";
import { trackingService } from "../../services/TrackingService";

export const QuizContainer: React.FC = () => {
  const filteredQuestions = useMemo(() => filterQuestions({}), []);
  const { state, handleStart, handleGoBack, handleReset, handleSelectOption } = useQuizState(filteredQuestions);
  
  const { stage, currentQuestionIndex, answers, baseScore, multiplier } = state;
  
  // Scroll to top when quiz starts and notify parent WordPress page
  useEffect(() => {
    if (stage === "quiz") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Notify parent WordPress page to scroll to iframe
      window.parent.postMessage({ type: 'quiz-started' }, '*');
    }
  }, [stage]);

  // Recalculate filtered questions based on current answers
  const currentFilteredQuestions = useMemo(() => filterQuestions(answers), [answers]);
  const currentQuestion = currentFilteredQuestions[currentQuestionIndex];
  
  const risk = useMemo(() => calculateRisk(baseScore, multiplier), [baseScore, multiplier]);
  const violations = useMemo(() => calculateViolations(answers), [answers]);

  // Track loading stage
  useEffect(() => {
    if (stage === "loading") {
      trackingService.trackLoading();
    }
  }, [stage]);

  // Track results viewed (after risk and violations are declared)
  useEffect(() => {
    if (stage === "results") {
      const sanctionMax = violations.reduce((total, v) => total + v.max, 0);
      trackingService.trackResultsViewed(
        risk.level,
        risk.finalScore,
        violations.length,
        sanctionMax,
        answers.settore || '',
        answers.gestione || ''
      );
    }
  }, [stage, risk, violations, answers]);
  
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
            onSelectOption={(question, option) => handleSelectOption(question, option, currentFilteredQuestions)}
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
            onReset={() => handleReset(risk.level)}
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
      <main className="container mx-auto max-w-3xl px-4 py-6 sm:py-8 pb-5 sm:pb-16">
        {renderStage()}
      </main>
    </div>
  );
};