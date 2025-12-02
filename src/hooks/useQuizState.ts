import { useReducer, useCallback } from "react";
import { QuizState, QuizAnswers, QuizQuestion } from "../types";
import { APP_CONFIG } from "../constants/quiz-config";
import { trackingService } from "../services/TrackingService";

// ==================== STATE MANAGEMENT ====================
const initialState: QuizState = {
  stage: "quiz", // Start directly with quiz (no intro in this SPA)
  currentQuestionIndex: 0,
  answers: {},
  baseScore: 0,
  multiplier: 1
};

type QuizAction = 
  | { type: 'SELECT_OPTION'; question: QuizQuestion; option: any }
  | { type: 'NEXT_QUESTION' }
  | { type: 'GO_BACK' }
  | { type: 'RESET' };

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'SELECT_OPTION': {
      const { question, option } = action;
      const newAnswers = { ...state.answers, [question.id]: option.value };
      
      let newBaseScore = state.baseScore;
      let newMultiplier = state.multiplier;
      
      if (question.type === "score") {
        const prevOption = question.options.find(o => o.value === state.answers[question.id]);
        newBaseScore = state.baseScore - (prevOption?.weight || 0) + (option.weight || 0);
      } else if (question.type === "multiplier") {
        const prevOption = question.options.find(o => o.value === state.answers[question.id]);
        const prevMul = prevOption?.multiplier || 1;
        newMultiplier = (state.multiplier / prevMul) * (option.multiplier || 1);
      }
      
      return {
        ...state,
        answers: newAnswers,
        baseScore: newBaseScore,
        multiplier: newMultiplier
      };
    }
    
    case 'NEXT_QUESTION':
      return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };
      
    case 'GO_BACK':
      return { ...state, currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1) };
      
    case 'RESET':
      return initialState;
      
    default:
      return state;
  }
};

// Encode quiz data for URL transfer
const encodeQuizData = (answers: QuizAnswers, baseScore: number, multiplier: number): string => {
  const data = { answers, baseScore, multiplier };
  return btoa(JSON.stringify(data));
};

export const useQuizState = (filteredQuestions: QuizQuestion[]) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  
  const handleGoBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);
  
  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);
  
  const handleSelectOption = useCallback((question: QuizQuestion, option: any, currentFilteredQuestions: QuizQuestion[]) => {
    // Track answer
    trackingService.trackAnswer(
      question.id,
      question.title,
      option.label,
      state.currentQuestionIndex
    );
    
    dispatch({ type: 'SELECT_OPTION', question, option });
    
    // Calculate new values after this selection
    let newBaseScore = state.baseScore;
    let newMultiplier = state.multiplier;
    
    if (question.type === "score") {
      const prevOption = question.options.find(o => o.value === state.answers[question.id]);
      newBaseScore = state.baseScore - (prevOption?.weight || 0) + (option.weight || 0);
    } else if (question.type === "multiplier") {
      const prevOption = question.options.find(o => o.value === state.answers[question.id]);
      const prevMul = prevOption?.multiplier || 1;
      newMultiplier = (state.multiplier / prevMul) * (option.multiplier || 1);
    }
    
    const newAnswers = { ...state.answers, [question.id]: option.value };
    
    setTimeout(() => {
      if (state.currentQuestionIndex < currentFilteredQuestions.length - 1) {
        dispatch({ type: 'NEXT_QUESTION' });
      } else {
        // Quiz completed - redirect to results SPA
        const encodedData = encodeQuizData(newAnswers, newBaseScore, newMultiplier);
        window.location.href = `../risultati/?data=${encodedData}`;
      }
    }, APP_CONFIG.ui.transitionDelay);
  }, [state.currentQuestionIndex, state.answers, state.baseScore, state.multiplier]);
  
  return {
    state,
    handleGoBack, 
    handleReset,
    handleSelectOption
  };
};
