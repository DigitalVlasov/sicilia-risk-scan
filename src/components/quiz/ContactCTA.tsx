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
            bullets: [
              "Valutazione della tua struttura di controllo attuale",
              "Identificazione aree da ottimizzare per massima efficacia",
              "Mappatura dei processi critici che richiedono la tua presenza"
            ]
          },
          {
            title: "Piano di Deleghe Strategiche",
            bullets: [
              "Come distribuire responsabilità mantenendo controllo operativo",
              "Definizione ruoli e competenze per il tuo team",
              "Sistema di monitoraggio senza micromanagement"
            ]
          },
          {
            title: "Analisi Time-Saving",
            bullets: [
              "Quantificazione ore recuperabili per il core business",
              "Automazione processi compliance ripetitivi",
              "Focus sul tuo valore aggiunto imprenditoriale"
            ]
          },
          {
            title: "ROI Diretto su Produttività",
            bullets: [
              "Calcolo preciso del ritorno economico",
              "Analisi costo-opportunità del tuo tempo",
              "Proiezione benefici a 12-24 mesi"
            ]
          }
        ];
      
      case "interno":
        return [
          {
            title: "Assessment Competenze Interne",
            bullets: [
              "Valutazione capacità del tuo team attuale",
              "Identificazione gap formativi prioritari",
              "Piano per massimizzare investimento in risorse"
            ]
          },
          {
            title: "Sistema di Supporto Specialistico",
            bullets: [
              "Integrazione expertise esterna senza sostituzioni",
              "Potenziamento efficacia risorse interne",
              "Backup professionale per situazioni critiche"
            ]
          },
          {
            title: "Formazione Mirata del Personale",
            bullets: [
              "Piano sviluppo specifico per referente interno",
              "Focus su competenze critiche mancanti",
              "Certificazioni e aggiornamenti normativi"
            ]
          },
          {
            title: "Analisi Efficienza Costi",
            bullets: [
              "Confronto gestione interna vs esternalizzazione",
              "Analisi ROI investimento in formazione",
              "Ottimizzazione budget sicurezza aziendale"
            ]
          }
        ];
      
      case "consulente":
        return [
          {
            title: "Benchmark di Mercato",
            bullets: [
              "Confronto performance consulente attuale vs standard",
              "Analisi best practice di settore",
              "Verifica rapporto qualità-prezzo dei servizi"
            ]
          },
          {
            title: "Gap Analysis Servizi",
            bullets: [
              "Identificazione servizi mancanti o sottoperformanti",
              "Analisi copertura normativa completa",
              "Valutazione proattività vs reattività"
            ]
          },
          {
            title: "Ottimizzazione Rapporto Qualità-Prezzo",
            bullets: [
              "Come ottenere più valore dall'investimento",
              "Negoziazione servizi aggiuntivi a parità di costo",
              "Alternative per ridurre costi mantenendo qualità"
            ]
          },
          {
            title: "Sistema di Controllo e KPI",
            bullets: [
              "Metriche concrete per misurare efficacia",
              "Dashboard di monitoraggio performance",
              "Garanzie su risultati e tempistiche"
            ]
          }
        ];
      
      case "studi-multipli":
        return [
          {
            title: "Audit Coordinamento Multi-Fornitore",
            bullets: [
              "Analisi inefficienze da gestione frammentata",
              "Identificazione costi nascosti e sovrapposizioni",
              "Mappatura responsabilità e competenze"
            ]
          },
          {
            title: "Strategia di Unificazione",
            bullets: [
              "Piano centralizzazione mantenendo specializzazioni",
              "Eliminazione duplicazioni e conflitti",
              "Semplificazione flussi informativi"
            ]
          },
          {
            title: "Calcolo Saving da Semplificazione",
            bullets: [
              "Quantificazione risparmi da eliminazione sovrapposizioni",
              "Riduzione costi amministrativi e coordinamento",
              "Ottimizzazione tempi di gestione"
            ]
          },
          {
            title: "Sistema di Controllo Unificato",
            bullets: [
              "Dashboard centralizzato multi-fornitore",
              "Monitoraggio performance, scadenze e costi",
              "Reporting unificato per decisioni strategiche"
            ]
          }
        ];
      
      default:
        return [
          {
            title: "Check-up Conformità 2025",
            bullets: [
              "Posizione rispetto ai nuovi obblighi normativi",
              "Identificazione gap critici da colmare",
              "Priorità di intervento personalizzate"
            ]
          },
          {
            title: "Piano Strategico",
            bullets: [
              "Date critiche da cerchiare in rosso",
              "Roadmap adempimenti scaglionati nel tempo",
              "Gestione proattiva vs reattiva delle scadenze"
            ]
          },
          {
            title: "Analisi Formazione Finanziata",
            bullets: [
              "Verifica opportunità Fondi Interprofessionali",
              "Calcolo formazione gratuita disponibile",
              "Ottimizzazione budget formativo aziendale"
            ]
          },
          {
            title: "Confronto Economico Trasparente",
            bullets: [
              "Analisi costi attuali vs nuovo sistema",
              "Calcolo ROI previsto su 12-24 mesi",
              "Valutazione costo-opportunità inazione"
            ]
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
        <ul className="space-y-3">
          {checklist.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">✓</span>
              <div>
                <div className="font-bold mb-1">{item.title}:</div>
                <ul className="space-y-1 ml-2">
                  {item.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start text-sm">
                      <span className="text-green-400 mr-1 text-xs">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
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