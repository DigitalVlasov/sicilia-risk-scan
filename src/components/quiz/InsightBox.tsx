import React from "react";
import { Card, CardContent } from "../ui/card";
import { DynamicInsight } from "../../types";

interface InsightBoxProps {
  insight: DynamicInsight;
  ctaTarget?: string;
}

export const InsightBox: React.FC<InsightBoxProps> = ({ 
  insight, 
  ctaTarget = "#contact-cta" 
}) => {
  // Parse the text to separate sections for better readability
  const parseInsightText = (text: string) => {
    // Split by double line breaks to identify paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    const sections = [];
    let currentSection = "";
    let warningSection = "";
    let gapSection = "";
    let inWarningSection = false;
    let inGapSection = false;
    
    for (const paragraph of paragraphs) {
      // Check if this paragraph starts with "Se vuoi" - this indicates the CTA section
      if (paragraph.trim().toLowerCase().startsWith('se vuoi')) {
        // Save current section if exists
        if (currentSection) {
          sections.push({ type: 'content', text: processContentText(currentSection.trim()) });
        }
        // Save warning section if exists
        if (warningSection) {
          sections.push({ type: 'warning', text: processContentText(warningSection.trim()) });
          warningSection = "";
        }
        // Save gap section if exists
        if (gapSection) {
          sections.push({ type: 'gap', text: processContentText(gapSection.trim()) });
          gapSection = "";
        }
        // Start CTA section
        sections.push({ type: 'cta', text: paragraph.trim() });
        currentSection = "";
      } 
      // Check if this paragraph contains "Spesso ciò che non viene detto" - this starts the warning section
      else if (paragraph.toLowerCase().includes('spesso ciò che non viene detto')) {
        // Save current section if exists
        if (currentSection) {
          sections.push({ type: 'content', text: processContentText(currentSection.trim()) });
          currentSection = "";
        }
        // Start warning section
        warningSection = paragraph;
        inWarningSection = true;
        inGapSection = false;
      }
      // Check if this paragraph starts with any violation scenario pattern - this starts the gap section
      else if (paragraph.toLowerCase().includes('affidarsi a') || 
               paragraph.toLowerCase().includes('lavorare con più specialisti') ||
               paragraph.toLowerCase().includes('avere una risorsa interna dedicata') ||
               paragraph.toLowerCase().includes('il tuo controllo diretto è un punto di forza')) {
        // Save current section if exists
        if (currentSection) {
          sections.push({ type: 'content', text: processContentText(currentSection.trim()) });
          currentSection = "";
        }
        // Save warning section if exists
        if (warningSection) {
          sections.push({ type: 'warning', text: processContentText(warningSection.trim()) });
          warningSection = "";
          inWarningSection = false;
        }
        // Start gap section
        gapSection = paragraph;
        inGapSection = true;
      }
      // If we're in warning section and this is a bullet point or continuation
      else if (inWarningSection && (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('Perdite') || paragraph.trim().startsWith('Potenziali') || paragraph.trim().startsWith('Lo stress'))) {
        warningSection += '\n\n' + paragraph;
      }
      // If we're in gap section and this is a bullet point or continuation
      else if (inGapSection && paragraph.trim().startsWith('•')) {
        gapSection += '\n\n' + paragraph;
      }
      else {
        // If we were in warning or gap section, close it
        if (inWarningSection) {
          sections.push({ type: 'warning', text: processContentText(warningSection.trim()) });
          warningSection = "";
          inWarningSection = false;
        }
        if (inGapSection) {
          sections.push({ type: 'gap', text: processContentText(gapSection.trim()) });
          gapSection = "";
          inGapSection = false;
        }
        // Add to current section
        currentSection += (currentSection ? '\n\n' : '') + paragraph;
      }
    }
    
    // Add remaining sections if they exist
    if (warningSection) {
      sections.push({ type: 'warning', text: processContentText(warningSection.trim()) });
    }
    if (gapSection) {
      sections.push({ type: 'gap', text: processContentText(gapSection.trim()) });
    }
    if (currentSection) {
      sections.push({ type: 'content', text: processContentText(currentSection.trim()) });
    }
    
    return sections;
  };

  const processContentText = (text: string) => {
    // First, handle the "Sapevi che" flow - merge it with previous content
    let processedText = text.replace(/\n\nSapevi che/g, ' Sapevi che');
    
    // Split into lines to process bullet points and formatting
    const lines = processedText.split('\n');
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
        // Apply bold formatting to bullet content
        let bulletContent = line.substring(1).trim();
        bulletContent = applyKeyTermBolding(bulletContent);
        result += `<li class="flex items-start gap-2"><span class="text-red-600 font-bold mt-1">•</span><span>${bulletContent}</span></li>`;
      } else {
        // Close bullet list if we were in one
        if (inBulletSection) {
          result += '</ul>';
          inBulletSection = false;
        }
        
        // Process regular paragraph
        if (line) {
          let processedLine = line;
          
          // Make "Spesso ciò che non viene detto è che..." text bold
          if (line.toLowerCase().includes('spesso ciò che non viene detto è che')) {
            processedLine = processedLine.replace(
              /(Spesso ciò che non viene detto è che.*?ti espone a:)/gi,
              '<strong>$1</strong>'
            );
          }
          
          // Apply general key term bolding
          processedLine = applyKeyTermBolding(processedLine);
          
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

  const applyKeyTermBolding = (text: string): string => {
    let processedText = text;
    
    // Convert any existing anchor tags to point to the contact CTA section (above FAQ)
    processedText = processedText.replace(/<a\s+[^>]*href\s*=\s*["'][^"']*["'][^>]*>/gi, '<a href="#contact-cta" class="text-red-600 hover:text-red-800 font-semibold underline transition-colors">');
    
    // Convert common CTA phrases to links with more intuitive button-like styling
    processedText = processedText.replace(/\b(analisi gratuita|consulenza gratuita|valutazione gratuita|scopri come|vedi come|analisi completa)\b/gi, '<a href="#contact-cta" class="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 rounded-md transition-all duration-200 shadow-sm hover:shadow-md no-underline">$1 →</a>');
    
    // Convert action phrases to more prominent CTAs
    processedText = processedText.replace(/\b(prenota ora|richiedi ora|contattaci|parlane con noi|fissa un appuntamento)\b/gi, '<a href="#contact-cta" class="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg no-underline">$1 →</a>');
    
    // Financial amounts and percentages
    processedText = processedText.replace(/€\s*[\d.,]+/g, '<strong>$&</strong>');
    processedText = processedText.replace(/(\d+(?:[.,]\d+)?)\s*%/g, '<strong>$1%</strong>');
    processedText = processedText.replace(/(\d+)\s*(giorni?|mesi?|anni?)/g, '<strong>$1 $2</strong>');
    
    // Legal and compliance terms
    processedText = processedText.replace(/\b(D\.Lgs\.?\s*\d+\/\d+|art\.\s*\d+|DVR|RSPP|RLS|INAIL|ASP|Ispettorato del Lavoro)\b/gi, '<strong>$&</strong>');
    
    // Critical actions and outcomes
    processedText = processedText.replace(/\b(sospensione|chiusura|multa|sanzione|arresto|denuncia|responsabilità penale|controllo ispettivo)\b/gi, '<strong>$&</strong>');
    
    // Time-sensitive and urgent terms
    processedText = processedText.replace(/\b(immediat[ao]|urgent[ei]|critico|priorità|scadenz[ae]|entro|prima di)\b/gi, '<strong>$&</strong>');
    
    // Key business terms
    processedText = processedText.replace(/\b(fatturato|produttività|costi|risparmi[ao]|perdite|clienti|dipendenti)\b/gi, '<strong>$&</strong>');
    
    // Compliance states
    processedText = processedText.replace(/\b(conformità|violazione|adeguamento|aggiornamento|formazione obbligatoria)\b/gi, '<strong>$&</strong>');
    
    return processedText;
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
              
              {section.type === 'warning' && (
                <div className="bg-gray-800 rounded-lg p-4 my-4">
                  <div 
                    className="text-sm sm:text-base text-white leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.text }}
                  />
                </div>
              )}
              
              {section.type === 'gap' && (
                <div className="bg-gray-800 rounded-lg p-4 my-4">
                  <div 
                    className="text-sm sm:text-base text-white leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.text }}
                  />
                </div>
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