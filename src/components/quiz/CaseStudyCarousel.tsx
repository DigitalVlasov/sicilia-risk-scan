import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "../ui/carousel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown } from "lucide-react";
import { CaseStudy } from "../../types";
import { CASE_STUDIES } from "../../constants/quiz-config";

export const CaseStudyCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [inView, setInView] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const expandTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeouts
  const clearTimeouts = useCallback(() => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
      autoplayTimeoutRef.current = null;
    }
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
      expandTimeoutRef.current = null;
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
      setIsExpanded(false); // Close details when sliding
    };

    carouselApi.on("select", onSelect);
    onSelect();

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Autoplay logic
  useEffect(() => {
    if (!inView || isInteracting || isExpanded || !carouselApi) {
      clearTimeouts();
      return;
    }

    const startAutoplay = () => {
      clearTimeouts();
      autoplayTimeoutRef.current = setTimeout(() => {
        if (carouselApi && !isInteracting && !isExpanded && inView) {
          carouselApi.scrollNext();
        }
      }, 3000);
    };

    startAutoplay();
    return () => clearTimeouts();
  }, [inView, isInteracting, isExpanded, carouselApi, currentIndex, clearTimeouts]);

  // Handle expand state changes
  const handleExpandChange = useCallback((expanded: boolean) => {
    setIsExpanded(expanded);
    clearTimeouts();
    
    if (expanded) {
      // Set timeout to resume after 8 seconds
      expandTimeoutRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 8000);
    }
  }, [clearTimeouts]);

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
          Trasformazioni aziendali concrete
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Risultati verificabili in 90 giorni
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
                    
                    {/* Risultato in evidenza */}
                    <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                      <p className="text-sm text-green-800 font-medium">
                        Adeguamento in 25 giorni, tutti i controlli superati con successo
                      </p>
                    </div>

                    {/* Collapsible per i dettagli */}
                    <Collapsible open={isExpanded && currentIndex === idx} onOpenChange={handleExpandChange}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:text-primary transition-colors">
                        <span>Vedi dettagli completi</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded && currentIndex === idx ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-3 mt-3">
                        {/* Criticità */}
                        <div className="border-l-2 border-red-500 pl-3">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                            Criticità rilevata
                          </h4>
                          <p className="text-sm text-foreground">{study.challenge}</p>
                        </div>
                        
                        {/* Soluzione */}
                        <div className="border-l-2 border-muted pl-3">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                            Intervento realizzato
                          </h4>
                          <p className="text-sm text-foreground">{study.solution}</p>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
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