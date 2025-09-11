import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Risk, QuizAnswers } from "../../types";
import { APP_CONFIG } from "../../constants/quiz-config";
import { getSectorName } from "../../utils/quiz-helpers";
import { UNIFIED_STYLES } from "../../constants/design-tokens";
interface ContactCTAProps {
  risk: Risk;
  sector?: string;
  answers: QuizAnswers;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({
  risk,
  sector,
  answers
}) => {
  // Get dynamic analysis steps that bridge from diagnosed situation to final benefits
  const getChecklistByManagement = () => {
    const managementType = answers.gestione;
    
    switch (managementType) {
      case "gestisco-io":
        return [
          "Calcolo preciso <strong>ore settimanali</strong> che recuperi per il business core",
          "Quantificazione <strong>valore economico</strong> del tuo tempo imprenditoriale attuale", 
          "Sistema <strong>controllo totale</strong> senza più perdere tempo in burocrazia",
          "Roadmap <strong>deleghe automatiche</strong> mantenendo decisioni sempre tue",
          "Confronto <strong>costi attuali</strong> vs automazione che lavora H24"
        ];
      
      case "interno":
        return [
          "Assessment <strong>sovraccarico effettivo</strong> della tua risorsa interna",
          "Calcolo <strong>costi nascosti</strong> di errori/ritardi per overload",
          "Piano <strong>alleggerimento operativo</strong> senza assumere personale",
          "Mappatura <strong>vulnerabilità operative</strong> in caso di assenze/ferie del referente sicurezza",
          "Confronto <strong>stress attuale</strong> vs gestione semplificata"
        ];
      
      case "consulente":
        return [
          "Benchmark <strong>tempi di risposta</strong> attuali vs accesso immediato 24/7",
          "Quantificazione <strong>costi nascosti</strong> dei ritardi nelle urgenze",
          "Piano <strong>mantenimento consulente</strong> + strumenti avanzati per lui",
          "Sistema <strong>controllo condiviso</strong> senza dipendere dalla sua agenda",
          "Calcolo <strong>ottimizzazione costi</strong> con servizi potenziati"
        ];
      
      case "studi-multipli":
        return [  
          "Mappatura <strong>tempo perso</strong> nel coordinamento quotidiano tra fornitori",
          "Quantificazione <strong>risparmi immediati</strong> eliminando sovrapposizioni",
          "Sistema <strong>cabina di regia</strong> per tutti i tuoi consulenti",
          "Eliminazione <strong>comunicazioni frammentate</strong> e responsabilità divise",
          "Confronto <strong>complessità attuale</strong> vs coordinamento centralizzato"
        ];
      
      default:
        return [
          "Check-up <strong>conformità 2025</strong> con quantificazione gap specifici",
          "Calcolo <strong>ROI previsto</strong> basato sulla tua situazione reale",
          "Identificazione <strong>priorità immediate</strong> per massimizzare risultati",
          "Piano <strong>implementazione graduale</strong> senza stravolgimenti operativi"
        ];
    }
  };

  const checklist = getChecklistByManagement();
  
  // Dynamic slot counter
  const [slotsLeft, setSlotsLeft] = useState(10);
  
  useEffect(() => {
    const targetSlots = Math.floor(Math.random() * 3) + 2; // Random between 2-4
    let currentSlots = 10;
    let timeoutId: NodeJS.Timeout;
    
    const updateSlots = () => {
      if (currentSlots > targetSlots) {
        currentSlots--;
        setSlotsLeft(currentSlots);
        
        // Calculate delay: shorter at beginning, longer as we progress
        const progress = (10 - currentSlots) / (10 - targetSlots);
        const baseDelay = 2000; // 2 seconds
        const maxDelay = 8000; // 8 seconds
        const delay = baseDelay + (maxDelay - baseDelay) * Math.pow(progress, 2);
        
        timeoutId = setTimeout(updateSlots, delay);
      }
    };
    
    // Start countdown after 3 seconds
    timeoutId = setTimeout(updateSlots, 3000);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  const whatsappHref = React.useMemo(() => {
    let message = `Ciao Spazio Impresa! Ho completato il test di conformità. `;
    
    if (risk.level === "Alto" || risk.level === "Medio") {
      const violationCount = risk.level === "Alto" ? "multiple criticità" : "alcune criticità";
      message += `Risultato: rischio ${risk.level} con ${violationCount} rilevate${sector ? ` nel settore ${getSectorName(sector)}` : ''}. `;
      message += `Vorrei prenotare l'Analisi Strategica Gratuita per vedere il confronto costi-benefici e capire come eliminare questi rischi.`;
    } else {
      message += `Risultato: rischio ${risk.level}${sector ? ` nel settore ${getSectorName(sector)}` : ''}. `;
      message += `Vorrei comunque confrontare il mio sistema attuale con il vostro per vedere se ci sono margini di ottimizzazione.`;
    }
    
    const text = encodeURIComponent(message);
    return `https://wa.me/+390955872480?text=${text}`;
  }, [risk.level, sector]);
  return <div className="rounded-lg border-2 border-green-500 bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 text-center shadow-xl">
      <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">
        Analisi Strategica Gratuita
      </h2>
      
      <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-xl mx-auto">
        Solo per chi ha completato questo test, abbiamo riservato 1 slot gratuito questo mese con il nostro Specialista Senior.
      </p>
      
      <div className="my-4 sm:my-6 p-4 sm:p-5 bg-white rounded border text-left max-w-lg mx-auto">
        <h4 className="font-bold text-center mb-4 text-base sm:text-lg">
          Cosa otterrai (gratuitamente):
        </h4>
        <ul className="space-y-3">
          {checklist.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-3 font-bold text-base">✓</span>
              <span 
                className="text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: item }} 
              />
            </li>
          ))}
        </ul>
      </div>
      
      <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4 sm:justify-center">
        <a href={whatsappHref} target="_blank" rel="noreferrer" className="block">
          <Button size="lg" className="w-full bg-green-600 text-white hover:bg-green-700">
            💬 Prenota via WhatsApp
          </Button>
        </a>
        <a href={`tel:${APP_CONFIG.contact.phone}`} className="block">
          <Button size="lg" variant="outline" className="w-full">
            📞 Chiama {APP_CONFIG.contact.phone}
          </Button>
        </a>
      </div>
      
      <p className="text-sm sm:text-base text-gray-600 mt-4">
        <strong>🏠 Riservato ad aziende siciliane</strong> • 
        <span className="font-semibold text-orange-600">
          Solo {slotsLeft} slot rimasti disponibili
        </span>
      </p>
    </div>;
};