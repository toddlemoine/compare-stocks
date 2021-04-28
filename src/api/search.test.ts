import { BASE_URL } from "./base";
import { search } from "./search";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { RawAVSearchResult } from "../types";

describe("search API", () => {
  const defaultAttrs = "symbol name type region marketOpen marketClose timezone currency matchScore"
    .split(" ")
    .reduce((acc, key, index) => {
      acc[`${index + 1}. ${key}`] = "";
      return acc;
    }, {} as RawAVSearchResult);

  const result = (symbol: string, name: string) => {
    return { ...defaultAttrs, ["1. symbol"]: symbol, ["2. name"]: name };
  };

  const server = setupServer(
    rest.get(`${BASE_URL}/query`, (_req, res, ctx) => {
      return res(
        ctx.json({
          bestMatches: [
            result("A", "Apples Inc"),
            result("B", "Bananas Inc"),
            result("K", "Kiwis Inc"),
          ],
        })
      );
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("returns an array of symbol search results", async () => {
    const result = await search("IBM");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
  });

  it("massages raw keys into something useful", async () => {
    const result = await search("IBM");
    expect(result[0]).toEqual({ name: "Apples Inc", symbol: "A" });
  });
});
