import { describe, it, expect } from "vitest";
import { serializeParams, parseParams } from "./params";

describe("serializeParams / parseParams", () => {
  it("always includes the calc id", () => {
    expect(serializeParams("cdi", {})).toBe("calc=cdi");
  });

  it("includes non-empty fields and omits empty ones", () => {
    const q = serializeParams("cdi", { valorInicial: "10000", percentualCDI: "", prazoDias: "365" });
    const params = new URLSearchParams(q);
    expect(params.get("calc")).toBe("cdi");
    expect(params.get("valorInicial")).toBe("10000");
    expect(params.get("prazoDias")).toBe("365");
    expect(params.has("percentualCDI")).toBe(false);
  });

  it("round-trips a populated input set", () => {
    const inputs = { valorInicial: "10000", percentualCDI: "110", taxaCDIAnual: "10.5", prazoDias: "365" };
    const parsed = parseParams("?" + serializeParams("cdi", inputs));
    expect(parsed.calcId).toBe("cdi");
    expect(parsed.inputs).toEqual(inputs);
  });

  it("parses a search string with no calc param", () => {
    const parsed = parseParams("?foo=bar");
    expect(parsed.calcId).toBeNull();
    expect(parsed.inputs).toEqual({ foo: "bar" });
  });

  it("parses an empty search string", () => {
    const parsed = parseParams("");
    expect(parsed.calcId).toBeNull();
    expect(parsed.inputs).toEqual({});
  });
});
