import React from "react";
import { Card, CardContent } from "../ui/card";
import { DynamicInsight } from "../../types/quiz";
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
    <Card className={UNIFIED_STYLES.cardDark}>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          <h2 className={`${UNIFIED_STYLES.titleSecondary} text-white mb-2`}>
            {insight.title}
          </h2>
          <p className={`${UNIFIED_STYLES.bodyText} text-gray-300`}>
            {insight.text}
          </p>
          <div className="pt-2 border-t border-gray-800">
            <a 
              href={ctaTarget} 
              className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors"
            >
              → Scopri come funziona per la tua situazione specifica
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};