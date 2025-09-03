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

export const ContactCTA: React.FC<ContactCTAProps> = ({ risk, sector }) => {
  const whatsappHref = React.useMemo(() => {
    const text = encodeURIComponent(
      `Ciao Spazio Impresa! Ho completato il test (rischio ${risk.level}). Vorrei prenotare la mia Analisi Strategica Gratuita per la mia azienda${sector ? ` nel settore ${getSectorName(sector)}` : ''}.`
    );
    return `https://wa.me/${APP_CONFIG.contact.whatsapp}?text=${text}`;
  }, [risk.level, sector]);

  return (
    <div className="rounded-lg border-2 border-green-500 bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 text-center shadow-xl">
      <h2 className="text-lg sm:text-xl font-bold text-black mb-3">
        Trasforma il rischio in tranquillità
      </h2>
      
      <p className="text-sm sm:text-base text-gray-700 mb-4 max-w-xl mx-auto">
        Prenota la tua <strong>Analisi Strategica Gratuita</strong>. 
        30 minuti, zero impegno, piano d'azione personalizzato.
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
              <strong>Mappatura Scadenze Critiche:</strong> Le date da cerchiare in rosso sul calendario.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2 font-bold">✓</span>
            <span>
              <strong>Analisi Formazione Finanziata:</strong> Verifica opportunità formative gratuite con i Fondi Interprofessionali.
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
    </div>
  );
};