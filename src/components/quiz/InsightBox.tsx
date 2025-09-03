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
          cardClass: "bg-gradient-to-br from-red-900 via-red-800 to-red-900 border-2 border-red-500 shadow-2xl shadow-red-900/30",
          titleClass: "text-red-100 font-black text-xl sm:text-2xl leading-tight tracking-tight",
          textClass: "text-red-50 text-base sm:text-lg leading-relaxed font-medium",
          ctaClass: "text-red-200 hover:text-white font-bold bg-red-800/50 hover:bg-red-700/70 px-4 py-2 rounded-lg border border-red-400/50 hover:border-red-300",
          accentClass: "border-red-400/60"
        };
      case 'medium':
        return {
          cardClass: "bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 border-2 border-amber-500 shadow-2xl shadow-amber-900/30",
          titleClass: "text-amber-100 font-black text-xl sm:text-2xl leading-tight tracking-tight",
          textClass: "text-amber-50 text-base sm:text-lg leading-relaxed font-medium",
          ctaClass: "text-amber-200 hover:text-white font-bold bg-amber-800/50 hover:bg-amber-700/70 px-4 py-2 rounded-lg border border-amber-400/50 hover:border-amber-300",
          accentClass: "border-amber-400/60"
        };
      default:
        return {
          cardClass: "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-2 border-slate-500 shadow-2xl shadow-slate-900/40",
          titleClass: "text-slate-100 font-black text-xl sm:text-2xl leading-tight tracking-tight",
          textClass: "text-slate-200 text-base sm:text-lg leading-relaxed font-medium",
          ctaClass: "text-slate-200 hover:text-white font-bold bg-slate-700/50 hover:bg-slate-600/70 px-4 py-2 rounded-lg border border-slate-400/50 hover:border-slate-300",
          accentClass: "border-slate-400/60"
        };
    }
  };

  const styles = getUrgencyStyles(insight.urgency);

  return (
    <div className="relative">
      {/* Glow effect per alta visibilità */}
      <div className={`absolute inset-0 bg-gradient-to-r ${
        insight.urgency === 'high' ? 'from-red-600/20 to-red-800/20' :
        insight.urgency === 'medium' ? 'from-amber-600/20 to-orange-800/20' :
        'from-slate-600/20 to-slate-800/20'
      } blur-xl -z-10 rounded-2xl`}></div>
      
      <Card className={`${styles.cardClass} transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] relative overflow-hidden`}>
        {/* Pattern decorativo sottile */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent transform rotate-45"></div>
        </div>
        
        <CardContent className="p-6 sm:p-8 relative z-10">
          <div className="space-y-5">
            <div className="space-y-3">
              <h2 className={styles.titleClass}>
                {insight.title}
              </h2>
              <p className={styles.textClass}>
                {insight.text}
              </p>
            </div>
            
            <div className={`pt-5 border-t ${styles.accentClass}`}>
              <a 
                href={ctaTarget} 
                className={`${styles.ctaClass} text-sm sm:text-base transition-all duration-300 hover:shadow-lg inline-flex items-center gap-2 group`}
              >
                <span>Forse dovresti vedere come gestiamo questi aspetti</span>
                <span className="text-xs group-hover:translate-y-0.5 transition-transform">↓</span>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};