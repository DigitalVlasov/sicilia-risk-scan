import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number; // 0-100
}

export const ProgressBar = ({ value }: ProgressBarProps) => {
  return (
    <div className="w-full">
      <Progress value={value} className="h-3 bg-muted" />
      <div className="mt-2 text-sm text-muted-foreground">{Math.round(value)}% completato</div>
    </div>
  );
};
