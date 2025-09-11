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
              "Valutazione <strong>struttura controllo</strong> attuale",
              "Identificazione <strong>aree ottimizzazione</strong> massima efficacia",
              "Mappatura <strong>processi critici</strong> presenza richiesta"
            ]
          },
          {
            title: "Piano di Deleghe Strategiche",
            bullets: [
              "Distribuzione <strong>responsabilità</strong> mantenendo controllo",
              "Definizione <strong>ruoli competenze</strong> team aziendale",
              "Sistema <strong>monitoraggio</strong> senza micromanagement"
            ]
          },
          {
            title: "Analisi Time-Saving",
            bullets: [
              "Quantificazione <strong>ore recuperabili</strong> core business",
              "Automazione <strong>processi compliance</strong> ripetitivi",
              "Focus <strong>valore aggiunto</strong> imprenditoriale"
            ]
          },
          {
            title: "ROI Diretto su Produttività",
            bullets: [
              "Calcolo <strong>ritorno economico</strong> preciso",
              "Analisi <strong>costo-opportunità</strong> tempo personale",
              "Proiezione <strong>benefici 12-24 mesi</strong>"
            ]
          }
        ];
      
      case "interno":
        return [
          {
            title: "Assessment Competenze Interne",
            bullets: [
              "Valutazione <strong>capacità team</strong> attuale",
              "Identificazione <strong>gap formativi</strong> prioritari",
              "Piano <strong>massimizzazione investimento</strong> risorse"
            ]
          },
          {
            title: "Sistema di Supporto Specialistico",
            bullets: [
              "Integrazione <strong>expertise esterna</strong> senza sostituzioni",
              "Potenziamento <strong>efficacia risorse</strong> interne",
              "Backup <strong>professionale</strong> situazioni critiche"
            ]
          },
          {
            title: "Formazione Mirata del Personale",
            bullets: [
              "Piano <strong>sviluppo specifico</strong> referente interno",
              "Focus <strong>competenze critiche</strong> mancanti",
              "Certificazioni <strong>aggiornamenti normativi</strong>"
            ]
          },
          {
            title: "Analisi Efficienza Costi",
            bullets: [
              "Confronto <strong>gestione interna</strong> vs esternalizzazione",
              "Analisi <strong>ROI investimento</strong> formazione",
              "Ottimizzazione <strong>budget sicurezza</strong> aziendale"
            ]
          }
        ];
      
      case "consulente":
        return [
          {
            title: "Benchmark di Mercato",
            bullets: [
              "Confronto <strong>performance consulente</strong> vs standard",
              "Analisi <strong>best practice</strong> di settore",
              "Verifica <strong>rapporto qualità-prezzo</strong> servizi"
            ]
          },
          {
            title: "Gap Analysis Servizi",
            bullets: [
              "Identificazione <strong>servizi mancanti</strong> sottoperformanti",
              "Analisi <strong>copertura normativa</strong> completa",
              "Valutazione <strong>proattività</strong> vs reattività"
            ]
          },
          {
            title: "Ottimizzazione Rapporto Qualità-Prezzo",
            bullets: [
              "Ottenere <strong>più valore</strong> dall'investimento",
              "Negoziazione <strong>servizi aggiuntivi</strong> parità costo",
              "Alternative <strong>riduzione costi</strong> mantenendo qualità"
            ]
          },
          {
            title: "Sistema di Controllo e KPI",
            bullets: [
              "Metriche <strong>concrete misurazione</strong> efficacia",
              "Dashboard <strong>monitoraggio performance</strong>",
              "Garanzie su <strong>risultati tempistiche</strong>"
            ]
          }
        ];
      
      case "studi-multipli":
        return [
          {
            title: "Audit Coordinamento Multi-Fornitore",
            bullets: [
              "Analisi <strong>inefficienze gestione</strong> frammentata",
              "Identificazione <strong>costi nascosti</strong> sovrapposizioni",
              "Mappatura <strong>responsabilità competenze</strong>"
            ]
          },
          {
            title: "Strategia di Unificazione",
            bullets: [
              "Piano <strong>centralizzazione</strong> mantenendo specializzazioni",
              "Eliminazione <strong>duplicazioni conflitti</strong>",
              "Semplificazione <strong>flussi informativi</strong>"
            ]
          },
          {
            title: "Calcolo Saving da Semplificazione",
            bullets: [
              "Quantificazione <strong>risparmi eliminazione</strong> sovrapposizioni",
              "Riduzione <strong>costi amministrativi</strong> coordinamento",
              "Ottimizzazione <strong>tempi gestione</strong>"
            ]
          },
          {
            title: "Sistema di Controllo Unificato",
            bullets: [
              "Dashboard <strong>centralizzato multi-fornitore</strong>",
              "Monitoraggio <strong>performance, scadenze, costi</strong>",
              "Reporting <strong>unificato decisioni</strong> strategiche"
            ]
          }
        ];
      
      default:
        return [
          {
            title: "Check-up Conformità 2025",
            bullets: [
              "Posizione rispetto <strong>nuovi obblighi</strong> normativi",
              "Identificazione <strong>gap critici</strong> da colmare",
              "Priorità <strong>intervento personalizzate</strong>"
            ]
          },
          {
            title: "Piano Strategico",
            bullets: [
              "Date <strong>critiche</strong> da cerchiare in rosso",
              "Roadmap <strong>adempimenti scaglionati</strong> nel tempo",
              "Gestione <strong>proattiva</strong> vs reattiva scadenze"
            ]
          },
          {
            title: "Analisi Formazione Finanziata",
            bullets: [
              "Verifica <strong>opportunità Fondi</strong> Interprofessionali",
              "Calcolo <strong>formazione gratuita</strong> disponibile",
              "Ottimizzazione <strong>budget formativo</strong> aziendale"
            ]
          },
          {
            title: "Confronto Economico Trasparente",
            bullets: [
              "Analisi <strong>costi attuali</strong> vs nuovo sistema",
              "Calcolo <strong>ROI previsto</strong> 12-24 mesi",
              "Valutazione <strong>costo-opportunità</strong> inazione"
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
                <div className="font-bold mb-1 text-sm">{item.title}:</div>
                <ul className="space-y-1 ml-2">
                  {item.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start text-xs">
                      <span className="text-green-400 mr-1 text-xs">•</span>
                      <span dangerouslySetInnerHTML={{ __html: bullet }} />
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