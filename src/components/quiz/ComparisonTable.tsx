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
      title: "Confronto: Multi-consulenza vs Sistema Coordinato",
      current: {
        label: "La tua situazione attuale",
        items: [
          "Più consulenti specializzati",
          "Competenze ultra-specifiche",
          "Controllo qualità per area",
          "Coordinamento manuale",
          "Risposte dipendenti da disponibilità"
        ]
      },
      proposed: {
        label: "Con il Sistema Spazio Impresa",
        items: [
          "Stessi consulenti + coordinamento",
          "Competenze specialistiche + sistema",
          "Controllo qualità + monitoraggio 24/7",
          "Coordinamento automatizzato",
          "Risposte immediate sempre disponibili"
        ]
      }
    },
    "consulente": {
      title: "Confronto: Consulente Esterno vs Sistema Integrato",
      current: {
        label: "La tua situazione attuale",
        items: [
          "Un professionista di fiducia",
          "Costi prevedibili e fissi",
          "Nessuna formazione interna",
          "Dipendenza dalla disponibilità",
          "Accesso limitato agli orari"
        ]
      },
      proposed: {
        label: "Con il Sistema Spazio Impresa",
        items: [
          "Stesso professionista + piattaforma",
          "Costi fissi + servizi aggiuntivi",
          "Formazione automatica inclusa",
          "Indipendenza operativa 24/7",
          "Accesso continuo a tutto"
        ]
      }
    },
    "interno": {
      title: "Confronto: Risorsa Interna vs Sistema Potenziato",
      current: {
        label: "La tua situazione attuale",
        items: [
          "Controllo diretto interno",
          "Conoscenza perfetta azienda",
          "Disponibilità immediata",
          "Gestione manuale scadenze",
          "Aggiornamenti da ricercare"
        ]
      },
      proposed: {
        label: "Con il Sistema Spazio Impresa",
        items: [
          "Stesso controllo + automazione",
          "Conoscenza aziendale + expertise",
          "Disponibilità + strumenti pro",
          "Gestione automatica scadenze",
          "Aggiornamenti automatici"
        ]
      }
    },
    "gestisco-io": {
      title: "Confronto: Gestione Diretta vs Sistema Automatizzato",
      current: {
        label: "La tua situazione attuale",
        items: [
          "Controllo totale personale",
          "Decisioni immediate",
          "Nessun intermediario",
          "Tempo dedicato alla burocrazia",
          "Gestione manuale completa"
        ]
      },
      proposed: {
        label: "Con il Sistema Spazio Impresa",
        items: [
          "Controllo strategico mantenuto",
          "Decisioni + tempo liberato",
          "Sistema diretto senza intermediari",
          "Tempo dedicato al business",
          "Gestione automatizzata"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Current situation */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">{data.current.label}</h3>
            <ul className="space-y-2">
              {data.current.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                  <span className="text-gray-500 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Proposed solution */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-bold text-green-800 mb-3 text-sm sm:text-base">{data.proposed.label}</h3>
            <ul className="space-y-2">
              {data.proposed.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                  <span className="text-green-600 mt-1 flex-shrink-0">✓</span>
                  <span className="text-green-800 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs sm:text-sm text-blue-800 font-medium text-center">
            🎯 <strong>Il vantaggio:</strong> Mantieni tutti i punti di forza attuali ed elimini le criticità
          </p>
        </div>
      </CardContent>
    </Card>
  );
};