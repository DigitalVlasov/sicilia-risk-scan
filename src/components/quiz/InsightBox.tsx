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
  // Parse the text to separate sections for better readability
  const parseInsightText = (text: string) => {
    // Split by double line breaks to identify paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    const sections = [];
    let currentSection = "";
    
    for (const paragraph of paragraphs) {
      // Check if this paragraph starts with "Se vuoi" - this indicates the CTA section
      if (paragraph.trim().toLowerCase().startsWith('se vuoi')) {
        // Save current section if exists
        if (currentSection) {
          sections.push({ type: 'content', text: currentSection.trim() });
        }
        // Start CTA section
        sections.push({ type: 'cta', text: paragraph.trim() });
        currentSection = "";
      } else {
        // Add to current section
        currentSection += (currentSection ? '\n\n' : '') + paragraph;
      }
    }
    
    // Add remaining content if exists
    if (currentSection) {
      sections.push({ type: 'content', text: currentSection.trim() });
    }
    
    return sections;
  };

  const sections = parseInsightText(insight.text);

  return (
    <Card className="border-2 border-red-600 shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-5">
          <h2 className="text-lg sm:text-xl font-bold text-black leading-tight">
            Cosa emerge dalle risposte:
          </h2>
          
          {sections.map((section, index) => (
            <div key={index}>
              {section.type === 'content' && (
                <div 
                  className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ __html: section.text.replace(/\n\n/g, '</p><p class="mt-3">').replace(/^/, '<p>').replace(/$/, '</p>') }}
                />
              )}
              
              {section.type === 'cta' && (
                <div className="mt-5 pt-4 border-t-2 border-gray-200 bg-gray-50 rounded-lg p-4">
                  <div 
                    className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4 font-medium"
                    dangerouslySetInnerHTML={{ __html: section.text }}
                  />
                  <a 
                    href={ctaTarget} 
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm sm:text-base px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    <span>{insight.ctaText || "Scopri come gestiamo questi aspetti per i nostri clienti"}</span>
                    <span className="text-xs">↓</span>
                  </a>
                </div>
              )}
            </div>
          ))}
          
          {/* Fallback CTA if no CTA section was found in text */}
          {!sections.some(s => s.type === 'cta') && (
            <div className="pt-3 border-t border-gray-200">
              <a 
                href={ctaTarget} 
                className="text-red-600 hover:text-red-800 font-semibold text-sm sm:text-base transition-colors duration-200 inline-flex items-center gap-1 hover:underline"
              >
                <span>{insight.ctaText || "Scopri come gestiamo questi aspetti per i nostri clienti"}</span>
                <span className="text-xs">↓</span>
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};