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
  
  // Dynamic copy based on management style with conversational tone
  const getOptimizedCopy = () => {
    switch (managementStyle) {
      case "gestisco-io":
        return {
          title: "INTERVENTO IMMEDIATO NECESSARIO",
          subtitle: "Stai gestendo tutto internamente, ma dalle risposte emergono lacune critiche che potrebbero costarti caro. Hai bisogno di una seconda opinione specializzata per validare il tuo approccio e correggere quello che non va.",
          ctaText: "Seconda Opinione Specializzata",
          benefit: "Conferma o correzione della strategia attuale"
        };
      case "interno": 
        return {
          title: "FERMA SUBITO LE PERDITE",
          subtitle: "Il tuo team interno sta facendo del suo meglio, ma ha evidenti gap di competenza in materia di sicurezza. Serve un supporto specialistico immediato per evitare che questi buchi si trasformino in sanzioni.", 
          ctaText: "Seconda Opinione Specializzata",
          benefit: "Accelerazione del processo interno"
        };
      case "consulente":
        return {
          title: "AUDIT INDIPENDENTE URGENTE", 
          subtitle: "Hai un consulente, ma dai risultati è chiaro che non sta coprendo tutti i rischi. Serve una verifica indipendente per capire cosa manca e garantire che sia tutto a norma.",
          ctaText: "Seconda Opinione Specializzata", 
          benefit: "Verifica standard e gap analysis"
        };
      case "studi-multipli":
        return {
          title: "COORDINAMENTO SPECIALISTICO",
          subtitle: "Lavori con più professionisti ma senza un coordinamento centrale, e questo sta creando lacune pericolose e sprechi. È il momento di mettere ordine con una strategia unificata.",
          ctaText: "Seconda Opinione Specializzata",
          benefit: "Ottimizzazione costi e tempi"
        };
      default:
        return {
          title: "INTERVENTO IMMEDIATO NECESSARIO",
          subtitle: "I rischi che abbiamo identificato nelle tue risposte sono seri e richiedono un intervento immediato. Hai bisogno di una seconda opinione specializzata per elaborare un piano d'emergenza efficace.",
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
          <>
            <strong>{copy.subtitle}</strong>
            <br />
            <span className="text-red-600 font-semibold">Solo 3 slot disponibili questa settimana</span>
          </>
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
      
      <p className={`${UNIFIED_STYLES.captionText} text-gray-600 mt-4`}>
        <strong>🏠 Riservato ad aziende siciliane</strong> • {hasViolations ? "Risposta GARANTITA entro 2h" : "Risposta entro 2h in orario di lavoro"}
      </p>
    </div>
  );
};