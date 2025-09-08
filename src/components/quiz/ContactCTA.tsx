import React from "react";
import { Button } from "../ui/button";
import { Risk } from "../../types";
import { APP_CONFIG } from "../../constants/quiz-config";
import { getSectorName } from "../../utils/quiz-helpers";
import { UNIFIED_STYLES } from "../../constants/design-tokens";
interface ContactCTAProps {
  risk: Risk;
  sector?: string;
}
export const ContactCTA: React.FC<ContactCTAProps> = ({
  risk,
  sector
}) => {
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
          <li className="flex items-start">
            <span className="text-green-500 mr-2 font-bold">✓</span>
            <span>
              <strong>Check-up Conformità {APP_CONFIG.version}:</strong> La tua posizione rispetto ai nuovi obblighi normativi.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2 font-bold">✓</span>
            <span>
              <strong>Piano Strategico</strong> Le date da cerchiare in rosso sul calendario.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2 font-bold">✓</span>
            <span>
              <strong>Analisi Formazione Finanziata:</strong> Verifica opportunità formative gratuite con i Fondi Interprofessionali.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2 font-bold">✓</span>
            <span>
              <strong>Confronto Economico Trasparente:</strong> Analisi dettagliata costi attuali vs benefici del nuovo sistema con ROI previsto.
            </span>
          </li>
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