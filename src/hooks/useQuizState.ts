import { useReducer, useCallback, useMemo } from "react";
import { QuizState, QuizAnswers, QuizQuestion } from "../types";
import { APP_CONFIG } from "../constants/quiz-config";

// ==================== STATE MANAGEMENT ====================
const initialState: QuizState = {
  stage: "intro",
  currentQuestionIndex: 0,
  answers: {},
  baseScore: 0,
  multiplier: 1
};

type QuizAction = 
  | { type: 'START_QUIZ' }
  | { type: 'SELECT_OPTION'; question: QuizQuestion; option: any }
  | { type: 'NEXT_QUESTION' }
  | { type: 'GO_BACK' }
  | { type: 'START_LOADING' }
  | { type: 'SHOW_RESULTS' }
  | { type: 'RESET' };

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'START_QUIZ':
      return { ...state, stage: "quiz" };
      
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
      
    case 'START_LOADING':
      return { ...state, stage: "loading" };
      
    case 'SHOW_RESULTS':
      return { ...state, stage: "results" };
      
    case 'RESET':
      return initialState;
      
    default:
      return state;
  }
};

export const useQuizState = (filteredQuestions: QuizQuestion[]) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  
  const handleStart = useCallback(() => {
    dispatch({ type: 'START_QUIZ' });
  }, []);
  
  const handleGoBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);
  
  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);
  
  const handleSelectOption = useCallback((question: QuizQuestion, option: any) => {
    dispatch({ type: 'SELECT_OPTION', question, option });
    
    setTimeout(() => {
      const newAnswers = { ...state.answers, [question.id]: option.value };
      // Import filterQuestions from utils to avoid circular dependency
      const nextFiltered = filteredQuestions; // This will be handled by parent component
      
      if (state.currentQuestionIndex < nextFiltered.length - 1) {
        dispatch({ type: 'NEXT_QUESTION' });
      } else {
        dispatch({ type: 'START_LOADING' });
        setTimeout(() => {
          dispatch({ type: 'SHOW_RESULTS' });
        }, APP_CONFIG.ui.loadingDelay);
      }
    }, APP_CONFIG.ui.transitionDelay);
  }, [state.currentQuestionIndex, state.answers, filteredQuestions]);
  
  return {
    state,
    handleStart,
    handleGoBack, 
    handleReset,
    handleSelectOption
  };
};