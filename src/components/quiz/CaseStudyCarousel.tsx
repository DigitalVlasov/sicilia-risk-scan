import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "../ui/carousel";
import { CaseStudy } from "../../types";
import { CASE_STUDIES } from "../../constants/quiz-config";
import { UNIFIED_STYLES, DESIGN_TOKENS } from "../../constants/design-tokens";

export const CaseStudyCarousel: React.FC = () => {
  const [currentCaseStudy, setCurrentCaseStudy] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [isInteracting, setIsInteracting] = useState(false);
  const [inView, setInView] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check for reduced motion preference
  const [autoPlayEnabled] = useState(() => {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Clear all timeouts
  const clearTimeouts = useCallback(() => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
      autoplayTimeoutRef.current = null;
    }
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = null;
    }
  }, []);

  // Setup intersection observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Setup carousel API listener
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentCaseStudy(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    onSelect();

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Autoplay logic
  useEffect(() => {
    if (!autoPlayEnabled || !inView || isInteracting || !carouselApi) {
      clearTimeouts();
      return;
    }

    const startAutoplay = () => {
      clearTimeouts();
      autoplayTimeoutRef.current = setTimeout(() => {
        if (carouselApi && !isInteracting && inView) {
          carouselApi.scrollNext();
        }
      }, 3000);
    };

    startAutoplay();
    return () => clearTimeouts();
  }, [autoPlayEnabled, inView, isInteracting, carouselApi, currentCaseStudy, clearTimeouts]);

  // Handle page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsInteracting(true);
      } else if (!document.hidden && isInteracting) {
        // Resume after page becomes visible again
        setIsInteracting(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isInteracting]);

  // Interaction handlers
  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true);
    clearTimeouts();
  }, [clearTimeouts]);

  const handleInteractionEnd = useCallback((resumeDelay: number = 2000) => {
    clearTimeouts();
    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, resumeDelay);
  }, [clearTimeouts]);

  const handleManualNavigation = useCallback((index: number) => {
    if (carouselApi) {
      carouselApi.scrollTo(index);
      handleInteractionStart();
      handleInteractionEnd(8000); // Longer pause for manual selection
    }
  }, [carouselApi, handleInteractionStart, handleInteractionEnd]);

  const handlePointerDown = useCallback(() => {
    handleInteractionStart();
    handleInteractionEnd(10000); // Long pause for touch/drag
  }, [handleInteractionStart, handleInteractionEnd]);

  return (
    <Card className="border border-gray-300 shadow-lg bg-white" ref={containerRef}>
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg sm:text-xl font-bold text-black">
          Casi di successo
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div 
          className="relative"
          onMouseEnter={handleInteractionStart}
          onMouseLeave={() => handleInteractionEnd(2000)}
          onFocusCapture={handleInteractionStart}
          onBlurCapture={() => handleInteractionEnd(2000)}
          onPointerDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        >
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {CASE_STUDIES.map((study, idx) => (
                <CarouselItem key={idx} className="px-2">
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all">
                    <div className="mb-4 sm:mb-5">
                      <h3 className="text-lg sm:text-xl font-bold text-black mb-2">
                        {study.title}
                      </h3>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 border border-red-200">
                        <span className="text-sm font-medium text-red-600">
                          {study.situation}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                        <h4 className="font-semibold text-red-600 text-sm mb-2">SFIDA</h4>
                        <p className="text-sm sm:text-base text-gray-700">
                          {study.challenge}
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                        <h4 className="font-semibold text-black text-sm mb-2">SOLUZIONE</h4>
                        <p className="text-sm sm:text-base text-gray-700">
                          {study.solution}
                        </p>
                      </div>
                      
                      <div className="bg-red-600 rounded-lg p-3 sm:p-4 border-2 border-red-700">
                        <h4 className="font-semibold text-white text-sm mb-2">RISULTATO</h4>
                        <p className="text-sm sm:text-base font-medium text-white">
                          {study.result}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Navigation dots */}
          <div className="flex justify-center gap-3 mt-6">
            {CASE_STUDIES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleManualNavigation(idx)}
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