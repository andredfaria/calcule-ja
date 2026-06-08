import { useEffect } from "react";
import { serializeParams, parseParams } from "./params";

/**
 * Syncs a calculator's string inputs with the URL.
 * - On mount: if the URL's `calc` matches `calcId`, calls `hydrate` with the parsed inputs.
 * - On change: reflects `values` into the URL via history.replaceState (no history pollution).
 */
export function useUrlState(
  calcId: string,
  values: Record<string, string>,
  hydrate: (inputs: Record<string, string>) => void,
): void {
  // Hydrate once on mount, only if the link targets this calculator.
  useEffect(() => {
    const { calcId: urlCalc, inputs } = parseParams(window.location.search);
    if (urlCalc === calcId && Object.keys(inputs).length > 0) {
      hydrate(inputs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect current values into the URL whenever the serialized query changes.
  const query = serializeParams(calcId, values);
  useEffect(() => {
    window.history.replaceState(null, "", `${window.location.pathname}?${query}`);
  }, [query]);
}
