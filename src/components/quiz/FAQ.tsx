import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const faqData = [
  {
    question: "Cosa è incluso nel Sistema Organizzativo Spazio Impresa?",
    answer: "Il sistema include: monitoraggio automatico di tutte le scadenze aziendali con alert preventivi, gestione coordinata di Medico Competente e soggetti formatori qualificati, piattaforma digitale per l'archiviazione e consultazione di tutti i documenti (DVR, attestati, organigramma, verbali), accesso privilegiato ai Fondi Interprofessionali per formazione gratuita, aggiornamenti automatici della documentazione per conformità normativa, supporto durante controlli ispettivi, e un referente unico che coordina l'intera rete di professionisti. Tutto gestito proattivamente senza che tu debba ricordare o sollecitare nulla."
  },
  {
    question: "Come funziona concretamente il sistema di alert?",
    answer: "Monitoriamo costantemente tutte le scadenze aziendali attraverso il nostro sistema gestionale. Ti avvisiamo via email 30-60 giorni prima di ogni scadenza e ci occupiamo direttamente delle prenotazioni necessarie. Ricevi sempre conferma di ogni azione intrapresa."
  },
  {
    question: "Quanto tempo richiede l'attivazione del servizio?",
    answer: "L'onboarding iniziale richiede circa 15 giorni lavorativi per la mappatura completa della situazione aziendale e l'inserimento nel nostro sistema di monitoraggio. Da quel momento il sistema diventa completamente automatico."
  },
  {
    question: "È adatto anche per aziende molto piccole?",
    answer: "Il sistema è pensato proprio per PMI che non possono permettersi internamente un ufficio dedicato alla sicurezza aziendale. Dalla ditta individuale all'azienda con 50 dipendenti, il valore aggiunto è ancora maggiore per le realtà più piccole che hanno meno tempo da dedicare alla burocrazia."
  },
  {
    question: "Cosa succede in caso di controllo ispettivo improvviso?",
    answer: "La documentazione è sempre aggiornata e immediatamente disponibile sulla piattaforma digitale. In caso di controllo, puoi accedere istantaneamente a tutti i documenti necessari. Il nostro team fornisce anche supporto telefonico immediato durante l'ispezione."
  },
  {
    question: "Come funziona l'accesso ai fondi per la formazione?",
    answer: "Ti iscriviamo al Fondo Interprofessionale più conveniente per la tua tipologia aziendale e gestiamo tutta la burocrazia per accedere ai finanziamenti. Spesso riusciamo a ottenere formazione completamente gratuita, con risparmi significativi sui costi annuali."
  },
  {
    question: "Qual è la durata del contratto?",
    answer: "Il contratto ha durata biennale per garantire continuità nel servizio e permettere una gestione efficace di tutti i processi. La continuità è fondamentale per mantenere il sistema di monitoraggio sempre efficiente e la conformità sempre aggiornata."
  }
];

export const FAQ: React.FC = () => {
  return (
    <Card className="border border-gray-300 shadow-lg bg-white">
      <CardHeader className="pb-2 sm:pb-4 border-b border-gray-200">
        <CardTitle className="text-lg sm:text-xl font-bold text-black">Domande Frequenti</CardTitle>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">(clicca sulle domande per approfondire)</p>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6">
        {faqData.map((faq, index) => (
          <details key={index} className="group bg-gray-50 rounded-lg border border-gray-200 overflow-hidden transition-all hover:shadow-md">
            <summary className="p-3 sm:p-4 cursor-pointer flex justify-between items-center hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-black text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                  {index + 1}
                </span>
                <span className="font-semibold text-sm sm:text-base text-black">{faq.question}</span>
              </div>
              <span className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
            </summary>
            <div className="p-3 sm:p-4 border-t bg-white">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </CardContent>
    </Card>
  );
};