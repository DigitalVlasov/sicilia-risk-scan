import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const faqData = [
  {
    question: "Devo cambiare tutto quello che sto facendo ora?",
    answer: "Assolutamente no. Mantieni tutto ciò che già funziona nella tua azienda. Il nostro sistema si integra con le tue procedure esistenti e migliora solo quello che serve, senza stravolgimenti. Il tuo modo di lavorare rimane invariato, ma diventa più efficiente."
  },
  {
    question: "Devo imparare ad usare sistemi complicati?",
    answer: "Zero. Non devi imparare nulla di nuovo. Pensiamo a tutto noi: ricevi solo email di promemoria e hai accesso semplice ai documenti tramite link diretti. Non ci sono software da installare, login complicati o procedure da memorizzare."
  },
  {
    question: "Ci sono costi nascosti oltre al servizio?",
    answer: "Il prezzo concordato include tutto: monitoraggio, promemoria, coordinamento professionisti e piattaforma digitale. Gli unici costi aggiuntivi sono quelli dei professionisti esterni (medico competente, formatori) che pagheresti comunque, ma spesso otteniamo sconti tramite convenzioni."
  },
  {
    question: "Come funziona la consulenza gratuita?",
    answer: "30 minuti di analisi telefonica dove mappiamo la tua situazione attuale, calcoliamo i risparmi di tempo e costi specifici per la tua azienda, e ti spieghiamo come funzionerebbe il sistema nel tuo caso. Zero impegno, zero pressione commerciale."
  },
  {
    question: "Una volta iniziato, mi vincolo per anni?",
    answer: "Il contratto è biennale per garantire continuità nel monitoraggio, ma se non sei soddisfatto nei primi 60 giorni, puoi recedere senza penali. La durata biennale serve per ammortizzare l'investimento iniziale di mappatura e per mantenere efficace il sistema di allerta."
  },
  {
    question: "È adatto anche alla mia piccola azienda?",
    answer: "È pensato proprio per PMI come la tua. Più sei piccolo, più il valore è alto: recuperi tempo prezioso da dedicare al business invece che alla burocrazia. Funziona dalla ditta individuale all'azienda con 50+ dipendenti."
  },
  {
    question: "Perdo tempo con riunioni e formazione?",
    answer: "Mai. Dopo l'analisi iniziale (30 min telefonici), il sistema diventa completamente passivo per te. Ricevi solo le comunicazioni essenziali via email. Non devi partecipare a riunioni, call di aggiornamento o sessioni di formazione."
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