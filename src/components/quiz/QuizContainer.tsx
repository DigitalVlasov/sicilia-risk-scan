import React, { useMemo, useEffect, useRef } from "react";
import { filterQuestions } from "../../utils/quiz-helpers";
import { useQuizState } from "../../hooks/useQuizState";
import { QuizStage } from "./QuizStage";
import { trackingService } from "../../services/TrackingService";

export const QuizContainer: React.FC = () => {
  const filteredQuestions = useMemo(() => filterQuestions({}), []);
  const { state, handleGoBack, handleSelectOption } = useQuizState(filteredQuestions);
  
  const { currentQuestionIndex, answers } = state;
  
  // Track quiz_started only once on mount
  const hasTrackedStart = useRef(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!hasTrackedStart.current) {
      trackingService.trackQuizStarted();
      hasTrackedStart.current = true;
    }
  }, []);

  // Recalculate filtered questions based on current answers
  const currentFilteredQuestions = useMemo(() => filterQuestions(answers), [answers]);
  const currentQuestion = currentFilteredQuestions[currentQuestionIndex];
  
  const totalQuestionsForDisplay = useMemo(() => {
    if (answers.settore) {
      return currentFilteredQuestions.length;
    }
    return 10; // Default for better initial UX
  }, [answers.settore, currentFilteredQuestions.length]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <main className="container mx-auto max-w-3xl px-4 py-6 sm:py-8 pb-5 sm:pb-16">
        <QuizStage
          question={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestionsForDisplay}
          answers={answers}
          onSelectOption={(question, option) => handleSelectOption(question, option, currentFilteredQuestions)}
          onGoBack={handleGoBack}
        />
      </main>
    </div>
  );
};
