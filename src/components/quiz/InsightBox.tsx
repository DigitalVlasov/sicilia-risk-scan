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
          sections.push({ type: 'content', text: processContentText(currentSection.trim()) });
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
      sections.push({ type: 'content', text: processContentText(currentSection.trim()) });
    }
    
    return sections;
  };

  const processContentText = (text: string) => {
    // Split into lines to process bullet points and formatting
    const lines = text.split('\n');
    let result = '';
    let inBulletSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if this is a bullet point line
      if (line.startsWith('•')) {
        if (!inBulletSection) {
          // Start bullet list
          result += '<ul class="space-y-2 mt-3 mb-3">';
          inBulletSection = true;
        }
        result += `<li class="flex items-start gap-2"><span class="text-red-600 font-bold mt-1">•</span><span>${line.substring(1).trim()}</span></li>`;
      } else {
        // Close bullet list if we were in one
        if (inBulletSection) {
          result += '</ul>';
          inBulletSection = false;
        }
        
        // Process regular paragraph
        if (line) {
          // Make "Spesso ciò che non viene detto è che..." text bold
          let processedLine = line;
          if (line.toLowerCase().includes('spesso ciò che non viene detto è che')) {
            processedLine = processedLine.replace(
              /(Spesso ciò che non viene detto è che.*?ti espone a:)/gi,
              '<strong>$1</strong>'
            );
          }
          
          // Add paragraph with proper spacing
          result += `<p class="mb-4">${processedLine}</p>`;
        }
      }
    }
    
    // Close bullet list if still open
    if (inBulletSection) {
      result += '</ul>';
    }
    
    return result;
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
                  className="text-sm sm:text-base text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.text }}
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