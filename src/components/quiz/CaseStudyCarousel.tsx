import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown } from "lucide-react";
import { CaseStudy } from "../../types";
import { CASE_STUDIES } from "../../constants/quiz-config";

export const CaseStudyCarousel: React.FC = () => {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy>(CASE_STUDIES[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          Trasformazioni aziendali concrete
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Risultati verificabili in 90 giorni
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropdown per selezionare il caso studio */}
        <Select
          value={selectedCaseStudy.id.toString()}
          onValueChange={(value) => {
            const caseStudy = CASE_STUDIES.find(cs => cs.id.toString() === value);
            if (caseStudy) {
              setSelectedCaseStudy(caseStudy);
              setIsExpanded(false);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleziona un caso studio" />
          </SelectTrigger>
          <SelectContent>
            {CASE_STUDIES.map((study) => (
              <SelectItem key={study.id} value={study.id.toString()}>
                <div className="flex items-center gap-2">
                  <span>{study.icon}</span>
                  <span className="font-medium">{study.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Preview compatto del caso selezionato */}
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">{selectedCaseStudy.title}</h3>
              <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                {selectedCaseStudy.situation}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">90 giorni</span>
          </div>
          
          {/* Risultato in evidenza */}
          <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
            <p className="text-sm text-green-800 font-medium">
              {selectedCaseStudy.result}
            </p>
          </div>

          {/* Collapsible per i dettagli */}
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:text-primary transition-colors">
              <span>Vedi dettagli completi</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3">
              {/* Criticità */}
              <div className="border-l-2 border-red-500 pl-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Criticità rilevata
                </h4>
                <p className="text-sm text-foreground">{selectedCaseStudy.challenge}</p>
              </div>
              
              {/* Soluzione */}
              <div className="border-l-2 border-muted pl-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Intervento realizzato
                </h4>
                <p className="text-sm text-foreground">{selectedCaseStudy.solution}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};