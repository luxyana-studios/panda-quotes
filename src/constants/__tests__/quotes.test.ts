import assert from "node:assert/strict";
import {
  CATEGORIZED_QUOTES,
  getQuoteForCategories,
  RED_PANDA_QUOTES,
} from "../quotes";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
    failed++;
  }
}

console.log("\nquotes.ts");

// ── Catalogue integrity ───────────────────────────────────────────────────────

test("has exactly 67 quotes", () => {
  assert.equal(CATEGORIZED_QUOTES.length, 67);
});

test("RED_PANDA_QUOTES is a string[] derived from CATEGORIZED_QUOTES", () => {
  assert.deepEqual(
    RED_PANDA_QUOTES,
    CATEGORIZED_QUOTES.map((q) => q.text),
  );
});

test("every quote has at least one category", () => {
  const empty = CATEGORIZED_QUOTES.filter((q) => q.categories.length === 0);
  assert.equal(
    empty.length,
    0,
    `Quotes with no categories: ${empty.map((_, i) => i + 1)}`,
  );
});

const VALID_CATEGORIES = [
  "Wisdom",
  "Patience",
  "Joy",
  "Nature",
  "Humor",
  "Courage",
  "Peace",
  "Growth",
  "Resilience",
  "Self-discovery",
];

test("all categories are from the valid set", () => {
  const invalid = CATEGORIZED_QUOTES.flatMap((q, i) =>
    q.categories
      .filter((c) => !VALID_CATEGORIES.includes(c))
      .map((c) => `quote ${i + 1}: "${c}"`),
  );
  assert.equal(invalid.length, 0, `Unknown categories: ${invalid.join(", ")}`);
});

// ── Spot-check plan spec assignments ─────────────────────────────────────────
// Checking a sample from each category per the plan specification.

test("Wisdom: quotes 1, 6, 32 are tagged Wisdom", () => {
  assert(
    CATEGORIZED_QUOTES[0].categories.includes("Wisdom"),
    "quote 1 missing Wisdom",
  );
  assert(
    CATEGORIZED_QUOTES[5].categories.includes("Wisdom"),
    "quote 6 missing Wisdom",
  );
  assert(
    CATEGORIZED_QUOTES[31].categories.includes("Wisdom"),
    "quote 32 missing Wisdom",
  );
});

test("Humor: quotes 18, 34, 45 are tagged Humor", () => {
  assert(
    CATEGORIZED_QUOTES[17].categories.includes("Humor"),
    "quote 18 missing Humor",
  );
  assert(
    CATEGORIZED_QUOTES[33].categories.includes("Humor"),
    "quote 34 missing Humor",
  );
  assert(
    CATEGORIZED_QUOTES[44].categories.includes("Humor"),
    "quote 45 missing Humor",
  );
});

test("Peace: quotes 3, 13, 54 are tagged Peace", () => {
  assert(
    CATEGORIZED_QUOTES[2].categories.includes("Peace"),
    "quote 3 missing Peace",
  );
  assert(
    CATEGORIZED_QUOTES[12].categories.includes("Peace"),
    "quote 13 missing Peace",
  );
  assert(
    CATEGORIZED_QUOTES[53].categories.includes("Peace"),
    "quote 54 missing Peace",
  );
});

test("Nature: quotes 8, 10, 19 are tagged Nature", () => {
  assert(
    CATEGORIZED_QUOTES[7].categories.includes("Nature"),
    "quote 8 missing Nature",
  );
  assert(
    CATEGORIZED_QUOTES[9].categories.includes("Nature"),
    "quote 10 missing Nature",
  );
  assert(
    CATEGORIZED_QUOTES[18].categories.includes("Nature"),
    "quote 19 missing Nature",
  );
});

test("Resilience: quotes 1, 9, 64 are tagged Resilience", () => {
  assert(
    CATEGORIZED_QUOTES[0].categories.includes("Resilience"),
    "quote 1 missing Resilience",
  );
  assert(
    CATEGORIZED_QUOTES[8].categories.includes("Resilience"),
    "quote 9 missing Resilience",
  );
  assert(
    CATEGORIZED_QUOTES[63].categories.includes("Resilience"),
    "quote 64 missing Resilience",
  );
});

test("Self-discovery: quotes 3, 10, 27 are tagged Self-discovery", () => {
  assert(
    CATEGORIZED_QUOTES[2].categories.includes("Self-discovery"),
    "quote 3 missing Self-discovery",
  );
  assert(
    CATEGORIZED_QUOTES[9].categories.includes("Self-discovery"),
    "quote 10 missing Self-discovery",
  );
  assert(
    CATEGORIZED_QUOTES[26].categories.includes("Self-discovery"),
    "quote 27 missing Self-discovery",
  );
});

// ── getQuoteForCategories ─────────────────────────────────────────────────────

test("empty categories → returns a quote from the full pool", () => {
  const quote = getQuoteForCategories([]);
  assert(RED_PANDA_QUOTES.includes(quote), "returned quote not in pool");
});

test("single category → returns a quote tagged with that category", () => {
  // Run many times to rule out lucky random hits
  for (let i = 0; i < 50; i++) {
    const quote = getQuoteForCategories(["Joy"]);
    const match = CATEGORIZED_QUOTES.find((q) => q.text === quote);
    assert(
      match?.categories.includes("Joy"),
      `returned quote not tagged Joy: "${quote}"`,
    );
  }
});

test("multiple categories → every returned quote matches at least one", () => {
  const cats = ["Patience", "Courage"];
  for (let i = 0; i < 50; i++) {
    const quote = getQuoteForCategories(cats);
    const match = CATEGORIZED_QUOTES.find((q) => q.text === quote);
    const ok = match?.categories.some((c) => cats.includes(c));
    assert(
      ok,
      `returned quote tagged neither Patience nor Courage: "${quote}"`,
    );
  }
});

test("unknown category → falls back to full pool", () => {
  const quote = getQuoteForCategories(["DoesNotExist"]);
  assert(RED_PANDA_QUOTES.includes(quote), "fallback failed");
});

test("Humor category pool has at least 20 quotes", () => {
  const pool = CATEGORIZED_QUOTES.filter((q) => q.categories.includes("Humor"));
  assert(pool.length >= 20, `Humor pool too small: ${pool.length}`);
});

test("Peace category pool has at least 10 quotes", () => {
  const pool = CATEGORIZED_QUOTES.filter((q) => q.categories.includes("Peace"));
  assert(pool.length >= 10, `Peace pool too small: ${pool.length}`);
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
