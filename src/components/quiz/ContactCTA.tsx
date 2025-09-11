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
          {
            title: "Audit Organizzativo Personalizzato",
            description: "Valutazione della tua struttura di controllo e identificazione delle aree da ottimizzare per massimizzare l'efficacia."
          },
          {
            title: "Piano di Deleghe Strategiche",
            description: "Come distribuire le responsabilità mantenendo il controllo operativo e riducendo il carico gestionale."
          },
          {
            title: "Analisi Time-Saving",
            description: "Quantifichiamo esattamente quanto tempo puoi recuperare per il core business automatizzando la compliance."
          },
          {
            title: "ROI Diretto su Produttività",
            description: "Calcolo preciso del ritorno economico derivante dalla riduzione del tempo dedicato alla sicurezza."
          }
        ];
      
      case "interno":
        return [
          {
            title: "Assessment Competenze Interne",
            description: "Valutazione delle capacità del tuo team e gap formativi per massimizzare l'investimento in risorse."
          },
          {
            title: "Sistema di Supporto Specialistico",
            description: "Come integrare expertise esterna senza sostituire le risorse interne, potenziandone l'efficacia."
          },
          {
            title: "Formazione Mirata del Personale",
            description: "Piano di sviluppo specifico per il tuo referente interno con focus su competenze critiche."
          },
          {
            title: "Analisi Efficienza Costi",
            description: "Confronto trasparente tra gestione interna potenziata vs esternalizzazione completa con analisi ROI."
          }
        ];
      
      case "consulente":
        return [
          {
            title: "Benchmark di Mercato",
            description: "Confronto performance del tuo consulente attuale vs standard di settore e best practice."
          },
          {
            title: "Gap Analysis Servizi",
            description: "Identificazione di servizi mancanti o sottoperformanti nella gestione attuale."
          },
          {
            title: "Ottimizzazione Rapporto Qualità-Prezzo",
            description: "Come ottenere più valore dall'investimento in consulenza o ridurre i costi mantenendo la qualità."
          },
          {
            title: "Sistema di Controllo e KPI",
            description: "Metriche concrete per misurare l'efficacia del consulente e garantire risultati tangibili."
          }
        ];
      
      case "studi-multipli":
        return [
          {
            title: "Audit Coordinamento Multi-Fornitore",
            description: "Analisi delle inefficienze generate dalla gestione frammentata e costi nascosti."
          },
          {
            title: "Strategia di Unificazione",
            description: "Piano per centralizzare la gestione mantenendo le specializzazioni necessarie."
          },
          {
            title: "Calcolo Saving da Semplificazione",
            description: "Quantificazione precisa dei risparmi ottenibili eliminando sovrapposizioni e duplicazioni."
          },
          {
            title: "Sistema di Controllo Unificato",
            description: "Dashboard centralizzato per monitorare performance, scadenze e costi di tutti i fornitori."
          }
        ];
      
      default:
        return [
          {
            title: "Check-up Conformità 2025",
            description: "La tua posizione rispetto ai nuovi obblighi normativi."
          },
          {
            title: "Piano Strategico",
            description: "Le date da cerchiare in rosso sul calendario."
          },
          {
            title: "Analisi Formazione Finanziata",
            description: "Verifica opportunità formative gratuite con i Fondi Interprofessionali."
          },
          {
            title: "Confronto Economico Trasparente",
            description: "Analisi dettagliata costi attuali vs benefici del nuovo sistema con ROI previsto."
          }
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
              <span>
                <strong>{item.title}:</strong> {item.description}
              </span>
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