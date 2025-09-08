import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { QuizAnswers } from "../../types";

interface ComparisonTableProps {
  answers: QuizAnswers;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ answers }) => {
  const managementType = answers.gestione;
  
  const comparisonData = {
    "studi-multipli": {
      title: "La verità sui sistemi multi-consulenza",
      current: {
        label: "Il problema che nessuno ti dice",
        items: [
          "Quando hai urgenza, nessuno si prende la responsabilità totale",
          "Ogni consulente conosce solo il suo pezzo",
          "Le informazioni si perdono tra un professionista e l'altro",
          "Paghi per il coordinamento, ma lo fai tu",
          "In caso di ispezione, ogni consulente dice 'non è competenza mia'"
        ]
      },
      proposed: {
        label: "La soluzione che funziona davvero",
        items: [
          "Un responsabile unico che coordina tutti i tuoi consulenti",
          "Ogni professionista lavora su una piattaforma condivisa",
          "Tutte le informazioni sono centralizzate e accessibili",
          "Il coordinamento è automatico e incluso nel prezzo",
          "Una sola persona risponde di tutto, sempre"
        ]
      }
    },
    "consulente": {
      title: "La realtà della consulenza esterna",
      current: {
        label: "Il problema che nessuno ti dice",
        items: [
          "Quando hai urgenza, è sempre impegnato con altri clienti",
          "Quando è disponibile lui, non sei disponibile tu", 
          "Paghi per ogni chiamata, anche per una semplice domanda",
          "Le sue competenze dipendono dalla sua esperienza personale",
          "Se si ammala o va in vacanza, sei bloccato"
        ]
      },
      proposed: {
        label: "La soluzione che funziona davvero",
        items: [
          "Il tuo consulente + una piattaforma che lavora 24/7",
          "Accesso immediato a tutte le informazioni, sempre",
          "Costo fisso che include supporto illimitato",
          "Competenze integrate con un sistema che non sbaglia mai",
          "Continuità garantita indipendentemente dalle persone"
        ]
      }
    },
    "interno": {
      title: "La verità sulle risorse interne",
      current: {
        label: "Il problema che nessuno ti dice", 
        items: [
          "Quella persona è sempre in overload e rischia il burnout",
          "Deve essere esperta di tutto: impossibile rimanere aggiornata",
          "Se sbaglia qualcosa, la responsabilità è solo tua",
          "Ogni aggiornamento normativo è una corsa contro il tempo",
          "Un errore umano può costare migliaia di euro di sanzioni"
        ]
      },
      proposed: {
        label: "La soluzione che funziona davvero",
        items: [
          "La tua risorsa si concentra sulla strategia, il sistema fa il resto",
          "Competenze specialistiche integrate nel sistema",
          "Responsabilità condivisa con partner esperti",
          "Aggiornamenti automatici senza stress",
          "Gli errori umani sono impossibili: tutto è automatizzato"
        ]
      }
    },
    "gestisco-io": {
      title: "Il costo nascosto della gestione diretta",
      current: {
        label: "Il problema che nessuno ti dice",
        items: [
          "Stai facendo un lavoro da €30/ora quando potresti fatturare €300/ora",
          "Ogni minuto sulla burocrazia è un cliente che non chiami",
          "Le competenze tecniche cambiano: tu quando le studi?",
          "Un errore ti costa migliaia di euro: ne vale la pena?",
          "I tuoi dipendenti aspettano risposte che potresti non avere"
        ]
      },
      proposed: {
        label: "La soluzione che funziona davvero",
        items: [
          "Tu prendi le decisioni strategiche, il sistema esegue",
          "Il tuo tempo torna sul business e sui clienti",
          "Competenze sempre aggiornate senza che tu debba studiare",
          "Zero errori possibili: tutto è verificato automaticamente",
          "Risposte immediate per te e il tuo team, sempre"
        ]
      }
    }
  };

  const data = comparisonData[managementType as keyof typeof comparisonData];
  
  if (!data) return null;

  return (
    <Card className="border border-gray-300 shadow-lg bg-white">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg sm:text-xl font-bold text-black">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current situation - Pain points */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="font-bold text-white mb-4 text-base">{data.current.label}</h3>
            <ul className="space-y-3">
              {data.current.items.map((item, index) => (
                <li key={index} className="text-sm text-gray-100 leading-relaxed border-l-2 border-red-500 pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Proposed solution - Benefits */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="font-bold text-white mb-4 text-base">{data.proposed.label}</h3>
            <ul className="space-y-3">
              {data.proposed.items.map((item, index) => (
                <li key={index} className="text-sm text-gray-100 leading-relaxed font-medium border-l-2 border-green-500 pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-red-600 rounded border border-red-700">
          <p className="text-sm text-white font-semibold text-center">
            <strong>Il risultato:</strong> Elimini tutti i problemi operativi mantenendo tutti i vantaggi attuali
          </p>
        </div>
      </CardContent>
    </Card>
  );
};