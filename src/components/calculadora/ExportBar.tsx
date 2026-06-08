import React, { useState, useEffect, useRef } from "react";

interface ExportBarProps {
  /** Returns the plain-text summary to copy. Called only when enabled. */
  resumoTexto: () => string;
  /** True when there is a valid result to export. */
  enabled: boolean;
}

export const ExportBar: React.FC<ExportBarProps> = ({ resumoTexto, enabled }) => {
  const [feedback, setFeedback] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const flash = (msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFeedback(msg);
    timerRef.current = setTimeout(() => setFeedback(""), 2000);
  };

  const copiarTexto = async () => {
    try {
      await navigator.clipboard.writeText(resumoTexto());
      flash("Resultado copiado!");
    } catch {
      flash("Não foi possível copiar.");
    }
  };

  const compartilharLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flash("Link copiado!");
    } catch {
      flash("Não foi possível copiar o link.");
    }
  };

  const btn =
    "text-sm px-3 py-1.5 rounded-lg border border-gray-300 transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      <button type="button" className={btn} onClick={copiarTexto} disabled={!enabled}>
        Copiar resultado
      </button>
      <button type="button" className={btn} onClick={compartilharLink} disabled={!enabled}>
        Compartilhar link
      </button>
      {feedback && (
        <span className="text-sm text-green-600" role="status">
          {feedback}
        </span>
      )}
    </div>
  );
};
