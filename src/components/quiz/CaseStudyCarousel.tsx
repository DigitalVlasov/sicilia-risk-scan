import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "../ui/carousel";
import { CaseStudy } from "../../types";
import { CASE_STUDIES } from "../../constants/quiz-config";

export const CaseStudyCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [isInteracting, setIsInteracting] = useState(false);
  const [inView, setInView] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeouts
  const clearTimeouts = useCallback(() => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
      autoplayTimeoutRef.current = null;
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
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    onSelect();

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Autoplay logic
  useEffect(() => {
    if (!inView || isInteracting || !carouselApi) {
      clearTimeouts();
      return;
    }

    const startAutoplay = () => {
      clearTimeouts();
      autoplayTimeoutRef.current = setTimeout(() => {
        if (carouselApi && !isInteracting && inView) {
          carouselApi.scrollNext();
        }
      }, 7000); // Increased to 7 seconds since details are always visible
    };

    startAutoplay();
    return () => clearTimeouts();
  }, [inView, isInteracting, carouselApi, currentIndex, clearTimeouts]);


  // Interaction handlers
  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true);
    clearTimeouts();
  }, [clearTimeouts]);

  const handleInteractionEnd = useCallback(() => {
    setTimeout(() => setIsInteracting(false), 2000);
  }, []);

  return (
    <Card className="border-border bg-card" ref={containerRef}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          Casi di successo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Scopri come abbiamo aiutato aziende simili alla tua
        </p>
      </CardHeader>
      <CardContent>
        <div 
          className="relative"
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          onTouchStart={handleInteractionStart}
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
                <CarouselItem key={idx}>
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <div className="mb-3">
                      <h3 className="font-semibold text-foreground mb-2">{study.title}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-destructive text-destructive-foreground">
                        {study.situation}
                      </span>
                    </div>

                    {/* Dettagli sempre visibili */}
                    <div className="space-y-3 mt-3">
                      {/* Criticità */}
                      <div className="border-l-2 border-red-500 pl-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Criticità rilevata
                        </h4>
                        <div className="text-sm text-foreground space-y-1">
                          {(() => {
                            const parts = study.challenge.split('\n\n•', 2);
                            const firstSentence = parts[0];
                            const bulletPoints = parts[1] ? '•' + parts[1] : '';
                            
                            return (
                              <>
                                 {/* Prima frase con sfondo rossiccio */}
                                 <div className="bg-red-50 border border-red-200 rounded p-2">
                                   <div className="text-xs text-red-700 font-medium mb-1">
                                     <strong>Rischi che stavano correndo:</strong>
                                   </div>
                                 </div>
                                
                                {/* Bullet points con sfondo bianco */}
                                {bulletPoints && (
                                  <div className="bg-white rounded p-2">
                                    <div 
                                      dangerouslySetInnerHTML={{ 
                                        __html: bulletPoints
                                          .replace(/\n•/g, '</span></li><li class="flex items-start gap-2"><span class="text-red-600 font-bold mt-0.5">•</span><span>')
                                          .replace(/^•/, '<ul class="space-y-1"><li class="flex items-start gap-2"><span class="text-red-600 font-bold mt-0.5">•</span><span>')
                                          .replace(/$/g, '</span></li></ul>')
                                      }}
                                    />
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      
                       {/* Benefici operativi */}
                       <div className="border-l-2 border-green-500 pl-3">
                         <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                           Benefici operativi per l'azienda
                         </h4>
                         
                         {/* Testo di cerniera */}
                         <div className="bg-green-50 border border-green-200 rounded p-2 mb-3">
                           <div className="text-xs text-green-800 font-medium">
                             <strong>Dopo l'attivazione del nostro sistema:</strong>
                           </div>
                         </div>
                         
                         <ul className="space-y-1">
                           {study.solution.map((benefit, idx) => (
                             <li key={idx} className="text-sm text-foreground flex items-start">
                               <span className="text-green-600 mr-2 mt-0.5">•</span>
                               <span dangerouslySetInnerHTML={{ __html: benefit }} />
                             </li>
                           ))}
                         </ul>
                       </div>
                    </div>
                    
                    {/* Risultato in evidenza - spostato in basso */}
                    <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
                      <p 
                        className="text-sm text-green-800 font-medium"
                        dangerouslySetInnerHTML={{ __html: study.result }}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-4">
            {CASE_STUDIES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => carouselApi?.scrollTo(idx)}
                className={`rounded-full transition-all ${
                  currentIndex === idx 
                    ? "w-8 h-2 bg-primary" 
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
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