import React from "react";
import { Card, CardContent } from "../ui/card";
import { UNIFIED_STYLES, DESIGN_TOKENS } from "../../constants/design-tokens";
import { APP_CONFIG } from "../../constants/quiz-config";

export const LoadingStage: React.FC = () => {
  return (
    <section aria-live="polite">
      <Card className={UNIFIED_STYLES.cardSecondary}>
        <CardContent className={`p-8 sm:p-10 text-center ${DESIGN_TOKENS.padding.spacious}`}>
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
          <h2 className={UNIFIED_STYLES.titleSecondary}>
            Analisi in corso...
          </h2>
          <p className={UNIFIED_STYLES.bodyText}>
            Confrontiamo le tue risposte con i {APP_CONFIG.legal.source}
          </p>
        </CardContent>
      </Card>
    </section>
  );
};