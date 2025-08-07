import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type AnswerOption = {
  label: string;
  value: string;
  weight: number; // 0 for segmentation
  sanction?: string; // es. "€2.315 - €7.631"
  details?: string; // testo normativo/approfondimento
};

export type Question = {
  id: string;
  title: string;
  type?: "select" | "single"; // default single
  options: AnswerOption[];
};

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: AnswerOption) => void;
  index: number;
  total: number;
}

export const QuestionCard = ({ question, onAnswer, index, total }: QuestionCardProps) => {
  const isSelect = question.type === "select";

  return (
    <Card className="animate-enter">
      <CardHeader>
        <CardTitle>
          <span className="text-muted-foreground">Domanda {index + 1} di {total}</span>
          <div className="mt-1 text-xl">{question.title}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSelect ? (
          <Select onValueChange={(val) => {
            const opt = question.options.find((o) => o.value === val);
            if (opt) onAnswer(opt);
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleziona una risposta" />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {question.options.map((opt) => (
              <Button key={opt.value} variant="default" className="w-full hover-scale" onClick={() => onAnswer(opt)}>
                {opt.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
