import React from "react";
import { Card, CardContent } from "../ui/card";
import { DynamicInsight } from "../../types";
import { UNIFIED_STYLES } from "../../constants/design-tokens";

interface InsightBoxProps {
  insight: DynamicInsight;
  ctaTarget?: string;
}

export const InsightBox: React.FC<InsightBoxProps> = ({ 
  insight, 
  ctaTarget = "#vantaggi-completi" 
}) => {
  return (
    <Card className={UNIFIED_STYLES.cardAccent}>
      <CardContent className="p-4 sm:p-6">
        <div className={UNIFIED_STYLES.cardSpacing}>
          <h2 className={`${UNIFIED_STYLES.titlePrimary} leading-tight`}>
            Cosa emerge dalle risposte:
          </h2>
          <p className={UNIFIED_STYLES.bodyText}>
            {insight.text}
          </p>
          
          <div className="pt-3 border-t border-red-100">
            <a 
              href={ctaTarget} 
              className={`${UNIFIED_STYLES.linkPrimary} font-semibold inline-flex items-center gap-1`}
            >
              <span>Scopri come gestiamo questi aspetti per i nostri clienti</span>
              <span className="text-xs">↓</span>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};