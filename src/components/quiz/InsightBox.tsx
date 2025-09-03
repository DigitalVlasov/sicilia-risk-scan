import React from "react";
import { Card, CardContent } from "../ui/card";
import { DynamicInsight } from "../../types";

interface InsightBoxProps {
  insight: DynamicInsight;
  ctaTarget?: string;
}

export const InsightBox: React.FC<InsightBoxProps> = ({ 
  insight, 
  ctaTarget = "#vantaggi-completi" 
}) => {
  return (
    <Card className="border-2 border-red-600 shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-black leading-tight">
            Cosa emerge dalle risposte:
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {insight.text}
          </p>
          <div className="pt-3 border-t border-gray-200">
            <a 
              href={ctaTarget} 
              className="text-red-600 hover:text-red-800 font-semibold text-sm sm:text-base transition-colors duration-200 inline-flex items-center gap-1 hover:underline"
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