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
}

export const ContactCTA: React.FC<ContactCTAProps> = ({
  risk,
  sector,
  answers
}) => {
  // Get dynamic checklist based on management type
  const getChecklistByManagement = () => {
    const managementType = answers.gestione;
    
    switch (managementType) {
      case "gestisco-io":
        return [
          "Identificazione <strong>ore recuperabili</strong> per il core business (quantificazione precisa)",
          "Piano <strong>deleghe immediate</strong> senza perdere controllo operativo",
          "Calcolo <strong>ROI economico</strong> su automazione processi sicurezza",
          "Sistema <strong>monitoraggio efficace</strong> senza micromanagement del team",
          "Valutazione <strong>costo-opportunità</strong> del tuo tempo imprenditoriale",
          "Roadmap <strong>ottimizzazione struttura</strong> di controllo aziendale"
        ];
      
      case "interno":
        return [
          "Assessment <strong>competenze critiche</strong> del tuo referente interno",
          "Identificazione <strong>gap formativi</strong> prioritari da colmare subito",
          "Piano <strong>potenziamento risorse</strong> esistenti senza nuove assunzioni",
          "Sistema <strong>backup professionale</strong> per emergenze e ferie",
          "Integrazione <strong>expertise esterna</strong> senza sostituire il team",
          "Confronto <strong>efficienza costi</strong> gestione interna vs esternalizzazione",
          "Percorso <strong>crescita professionale</strong> referente con certificazioni"
        ];
      
      case "consulente":
        return [
          "Benchmark <strong>performance attuale</strong> vs standard di mercato",
          "Verifica <strong>rapporto qualità-prezzo</strong> dei servizi ricevuti",
          "Identificazione <strong>servizi mancanti</strong> o sottoperformanti",
          "Piano <strong>ottimizzazione costi</strong> mantenendo la qualità",
          "Sistema <strong>controllo qualità</strong> e KPI misurabili",
          "Negoziazione <strong>servizi aggiuntivi</strong> a parità di investimento",
          "Valutazione <strong>alternative di mercato</strong> per confronto trasparente"
        ];
      
      case "studi-multipli":
        return [
          "Analisi <strong>costi nascosti</strong> della gestione frammentata attuale",
          "Mappatura <strong>sovrapposizioni</strong> e duplicazioni tra fornitori",
          "Quantificazione <strong>risparmi immediati</strong> da centralizzazione",
          "Piano <strong>unificazione graduale</strong> senza interruzioni operative",
          "Dashboard <strong>controllo centralizzato</strong> di tutti i fornitori",
          "Eliminazione <strong>conflitti competenze</strong> e responsabilità",
          "Sistema <strong>reporting unificato</strong> per decisioni strategiche",
          "Calcolo <strong>tempo risparmiato</strong> nel coordinamento quotidiano"
        ];
      
      default:
        return [
          "Check-up <strong>conformità 2025</strong> rispetto ai nuovi obblighi",
          "Identificazione <strong>priorità immediate</strong> per la tua azienda",
          "Calcolo <strong>ROI previsto</strong> dell'investimento in 12-24 mesi",
          "Verifica <strong>formazione gratuita</strong> disponibile con Fondi",
          "Confronto <strong>costi attuali</strong> vs benefici nuovo sistema",
          "Roadmap <strong>adempimenti scaglionati</strong> senza stress operativo"
        ];
    }
  };

  const checklist = getChecklistByManagement();
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
      <h2 className="text-lg sm:text-xl font-bold text-black mb-3">
        Analisi Strategica Gratuita
      </h2>
      
      <p className="text-sm sm:text-base text-gray-700 mb-4 max-w-xl mx-auto">
        Parla con uno specialista senior che ha già risolto 500+ casi simili in Sicilia. 30 minuti, zero impegno, preventivo trasparente.
      </p>
      
      <div className="my-4 sm:my-6 p-3 sm:p-4 bg-white rounded border text-left text-sm max-w-md mx-auto">
        <h4 className="font-bold text-center mb-3 text-sm sm:text-base">
          Cosa otterrai (gratuitamente):
        </h4>
        <ul className="space-y-2">
          {checklist.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">✓</span>
              <span 
                className="text-xs"
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
      
      <p className={`${UNIFIED_STYLES.captionText} text-gray-600 mt-4`}>
        <strong>🏠 Riservato ad aziende siciliane</strong> • Risposta entro 2h in orario di lavoro
      </p>
    </div>;
};