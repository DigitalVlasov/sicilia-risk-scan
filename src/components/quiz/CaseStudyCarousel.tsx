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
          🏆 Come abbiamo trasformato aziende siciliane come la tua
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Risultati concreti ottenuti in 90 giorni (o meno)
        </p>
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
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg border-2 border-gray-200 p-5 sm:p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 animate-fade-in">
                    {/* Header with timeline badge */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-black mb-3 leading-tight">
                          {study.title}
                        </h3>
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-50 border-2 border-red-200">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                          <span className="text-sm font-semibold text-red-700">
                            {study.situation}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 bg-green-100 border border-green-300 rounded-lg px-3 py-2 text-center min-w-0 flex-shrink-0">
                        <div className="text-xs font-medium text-green-700 uppercase tracking-wider">Risolto in</div>
                        <div className="text-sm font-bold text-green-800">90 giorni</div>
                      </div>
                    </div>
                    
                    {/* Three-section layout with icons and better contrast */}
                    <div className="space-y-4">
                      {/* Challenge section */}
                      <div className="relative bg-red-50 rounded-lg p-4 border-l-4 border-red-500 hover:bg-red-100 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            ⚠
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-red-700 text-sm mb-2 uppercase tracking-wide">Problema</h4>
                            <p className="text-sm text-red-800 font-medium leading-relaxed">
                              {study.challenge}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Solution section */}
                      <div className="relative bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500 hover:bg-blue-100 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            🔧
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-blue-700 text-sm mb-2 uppercase tracking-wide">Intervento</h4>
                            <p className="text-sm text-blue-800 font-medium leading-relaxed">
                              {study.solution}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Result section - highlight */}
                      <div className="relative bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-4 border-2 border-green-700 shadow-lg hover:shadow-xl transition-all">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-white text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                            ✓
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-sm mb-2 uppercase tracking-wide">Risultato ottenuto</h4>
                            <p className="text-sm text-white font-semibold leading-relaxed">
                              {study.result}
                            </p>
                          </div>
                        </div>
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