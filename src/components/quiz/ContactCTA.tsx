import React from "react";
import { Button } from "../ui/button";
import { Risk, QuizAnswers } from "../../types";
import { APP_CONFIG } from "../../constants/quiz-config";
import { getSectorName } from "../../utils/quiz-helpers";
import { UNIFIED_STYLES } from "../../constants/design-tokens";

interface ContactCTAProps {
  risk: Risk;
  sector?: string;
  answers: QuizAnswers;
  violations?: any[];
}

export const ContactCTA: React.FC<ContactCTAProps> = ({ risk, sector, answers, violations = [] }) => {
  const hasViolations = violations.length > 0;
  const managementStyle = answers.gestione;
  
  // Dynamic copy based on management style with specific focused versions
  const getOptimizedCopy = () => {
    switch (managementStyle) {
      case "gestisco-io":
        return {
          title: "Seconda opinione per validare il tuo approccio interno",
          subtitle: "Confronto metodologie: stai gestendo tutto internamente, ma dalle risposte emergono lacune critiche. Ottieni una verifica professionale senza impegno per confermare o correggere la tua strategia attuale.",
          ctaText: "Seconda Opinione Specializzata",
          benefit: "Conferma o correzione strategia"
        };
      case "interno": 
        return {
          title: "Supporto specialistico per il tuo team tecnico",
          subtitle: "Integrazione competenze: il tuo team interno ha evidenti gap di competenza in materia di sicurezza. Scopri come accelerare il processo interno con un supporto mirato e senza rischi.", 
          ctaText: "Seconda Opinione Specializzata",
          benefit: "Accelerazione processo interno"
        };
      case "consulente":
        return {
          title: "Audit indipendente del lavoro in corso", 
          subtitle: "Qualità e completezza: hai un consulente, ma dai risultati è chiaro che non sta coprendo tutti i rischi. Ottieni una verifica standard indipendente per identificare gap e lacune.",
          ctaText: "Seconda Opinione Specializzata", 
          benefit: "Verifica standard e gap analysis"
        };
      case "studi-multipli":
        return {
          title: "Coordinamento specialistico centralizzato",
          subtitle: "Orchestrazione competenze: lavori con più professionisti senza coordinamento centrale, creando lacune e sprechi. Scopri come ottimizzare costi e tempi con una strategia unificata.",
          ctaText: "Seconda Opinione Specializzata",
          benefit: "Ottimizzazione costi e tempi"
        };
      default:
        return {
          title: "Seconda opinione specializzata urgente",
          subtitle: "I rischi identificati nelle tue risposte richiedono un intervento immediato. Ottieni un piano d'azione personalizzato senza impegno per proteggere la tua azienda.",
          ctaText: "Seconda Opinione Specializzata",
          benefit: "Piano d'azione personalizzato e urgente"
        };
    }
  };

  const copy = getOptimizedCopy();
  
  const whatsappHref = React.useMemo(() => {
    const text = encodeURIComponent(
      `Ciao Spazio Impresa! Ho completato il test (rischio ${risk.level}). Vorrei prenotare la mia ${copy.ctaText} per la mia azienda${sector ? ` nel settore ${getSectorName(sector)}` : ''}.`
    );
    return `https://wa.me/${APP_CONFIG.contact.whatsapp}?text=${text}`;
  }, [risk.level, sector, copy.ctaText]);

  // Use urgent styling for violations, calm for no violations
  const containerStyles = hasViolations 
    ? "rounded-lg border-2 border-red-500 bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 text-center shadow-xl"
    : "rounded-lg border-2 border-green-500 bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 text-center shadow-xl";
    
  const checkmarkColor = hasViolations ? "text-red-500" : "text-green-500";
  const buttonColor = hasViolations 
    ? "bg-red-600 text-white hover:bg-red-700" 
    : "bg-green-600 text-white hover:bg-green-700";

  return (
    <div className={containerStyles}>
      <h2 className="text-lg sm:text-xl font-bold text-black mb-3">
        {hasViolations ? copy.title : "Trasforma il rischio in tranquillità"}
      </h2>
      
      <p className="text-sm sm:text-base text-gray-700 mb-4 max-w-xl mx-auto">
        {hasViolations ? (
          copy.subtitle
        ) : (
          <>Prenota la tua <strong>Analisi Strategica Gratuita</strong>. 30 minuti, zero impegno, piano d'azione personalizzato.</>
        )}
      </p>
      
      <div className="my-4 sm:my-6 p-3 sm:p-4 bg-white rounded border text-left text-sm max-w-md mx-auto">
        <h4 className="font-bold text-center mb-3 text-sm sm:text-base">
          {hasViolations ? "Consulenza riservata include:" : "Cosa otterrai (gratuitamente):"}
        </h4>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className={`${checkmarkColor} mr-2 font-bold`}>✓</span>
            <span>
              <strong>Check-up Conformità {APP_CONFIG.version}:</strong> La tua posizione rispetto ai nuovi obblighi normativi.
            </span>
          </li>
          <li className="flex items-start">
            <span className={`${checkmarkColor} mr-2 font-bold`}>✓</span>
            <span>
              <strong>Mappatura Scadenze Critiche:</strong> Le date da cerchiare in rosso sul calendario.
            </span>
          </li>
          <li className="flex items-start">
            <span className={`${checkmarkColor} mr-2 font-bold`}>✓</span>
            <span>
              <strong>{copy.benefit}:</strong> {hasViolations ? "Confronto con competitor conformi del tuo settore." : "Verifica opportunità formative gratuite con i Fondi Interprofessionali."}
            </span>
          </li>
        </ul>
      </div>
      
      <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4 sm:justify-center">
        <a href={whatsappHref} target="_blank" rel="noreferrer" className="block">
          <Button size="lg" className={`w-full ${buttonColor}`}>
            💬 {copy.ctaText}
          </Button>
        </a>
        <a href={`tel:${APP_CONFIG.contact.phone}`} className="block">
          <Button size="lg" variant="outline" className="w-full">
            📞 Chiama {APP_CONFIG.contact.phone}
          </Button>
        </a>
      </div>
      
      {hasViolations && (
        <p className="text-red-600 font-semibold text-sm mt-3 mb-2">
          ⏰ Solo 3 slot disponibili questa settimana
        </p>
      )}
      
      <p className={`${UNIFIED_STYLES.captionText} text-gray-600 mt-4`}>
        <strong>🏠 Riservato ad aziende siciliane</strong> • {hasViolations ? "Risposta GARANTITA entro 2h" : "Risposta entro 2h in orario di lavoro"}
      </p>
    </div>
  );
};