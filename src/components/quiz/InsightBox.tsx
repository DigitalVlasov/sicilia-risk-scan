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
  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return {
          cardClass: "bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-lg shadow-red-100/20",
          titleClass: "text-red-900 font-bold text-lg sm:text-xl leading-tight",
          textClass: "text-red-800 text-base leading-relaxed",
          ctaClass: "text-red-600 hover:text-red-700 font-semibold"
        };
      case 'medium':
        return {
          cardClass: "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-lg shadow-amber-100/20",
          titleClass: "text-amber-900 font-bold text-lg sm:text-xl leading-tight",
          textClass: "text-amber-800 text-base leading-relaxed",
          ctaClass: "text-amber-600 hover:text-amber-700 font-semibold"
        };
      default:
        return {
          cardClass: "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 shadow-lg shadow-emerald-100/20",
          titleClass: "text-emerald-900 font-bold text-lg sm:text-xl leading-tight",
          textClass: "text-emerald-800 text-base leading-relaxed",
          ctaClass: "text-emerald-600 hover:text-emerald-700 font-semibold"
        };
    }
  };

  const styles = getUrgencyStyles(insight.urgency);

  return (
    <Card className={`${styles.cardClass} transition-all duration-300 hover:shadow-xl`}>
      <CardContent className="p-6 sm:p-8">
        <div className="space-y-4">
          <h2 className={styles.titleClass}>
            {insight.title}
          </h2>
          <p className={styles.textClass}>
            {insight.text}
          </p>
          <div className="pt-4 border-t border-current/20">
            <a 
              href={ctaTarget} 
              className={`${styles.ctaClass} text-sm sm:text-base transition-all duration-200 hover:underline decoration-2 underline-offset-4 flex items-center gap-1`}
            >
              <span>Forse dovresti dare un'occhiata a come gestiamo questi aspetti</span>
              <span className="text-xs">↓</span>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};