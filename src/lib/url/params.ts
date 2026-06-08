/** Serialize a calculator id + its string inputs into a URL query string. Empty values are omitted. */
export function serializeParams(calcId: string, inputs: Record<string, string>): string {
  const params = new URLSearchParams();
  params.set("calc", calcId);
  for (const [key, value] of Object.entries(inputs)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  return params.toString();
}

/** Parse a location.search string into the calc id (or null) and the remaining inputs. */
export function parseParams(search: string): { calcId: string | null; inputs: Record<string, string> } {
  const params = new URLSearchParams(search);
  const calcId = params.get("calc");
  const inputs: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    if (key !== "calc") inputs[key] = value;
  }
  return { calcId, inputs };
}
