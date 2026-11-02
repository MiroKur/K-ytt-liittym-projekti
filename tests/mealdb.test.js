import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeMeal,
  safeImage,
  searchMeals,
  getMeal,
  getCategories,
} from "../src/services/mealdb.js";

test("normalisointi ohittaa tyhjät ainesosat ja säilyttää määrät", () => {
  const meal = normalizeMeal({
    idMeal: "1",
    strMeal: " Test ",
    strIngredient1: "Salt",
    strMeasure1: "1 tsp",
    strIngredient2: " ",
    strIngredient20: "Water",
  });
  assert.equal(meal.name, "Test");
  assert.deepEqual(meal.ingredients, [
    { name: "Salt", amount: "1 tsp" },
    { name: "Water", amount: "" },
  ]);
  assert.equal(normalizeMeal({ idMeal: "bad", strMeal: "Test" }), null);
});
test("kuva hyväksyy vain https-osoitteen", () => {
  assert.equal(safeImage("javascript:alert(1)"), "");
  assert.equal(safeImage(null), "");
  assert.equal(
    safeImage("https://example.com/food.jpg"),
    "https://example.com/food.jpg",
  );
});
test("API käsittelee null-tuloksen, virheet ja turvallisen hakusanan", async () => {
  const original = globalThis.fetch;
  try {
    let requested;
    globalThis.fetch = async (url) => {
      requested = url;
      return { ok: true, json: async () => ({ meals: null }) };
    };
    assert.deepEqual(await searchMeals("a & b"), []);
    assert.ok(requested.endsWith("s=a%20%26%20b"));
    assert.equal(await getMeal("1"), null);
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({ nope: [] }),
    });
    await assert.rejects(searchMeals("a"));
    await assert.rejects(getCategories());
    globalThis.fetch = async () => ({ ok: false });
    await assert.rejects(searchMeals("a"));
  } finally {
    globalThis.fetch = original;
  }
});
test("AbortSignal välitetään fetchille", async () => {
  const original = globalThis.fetch;
  const controller = new AbortController();
  try {
    globalThis.fetch = async (_, options) => {
      assert.equal(options.signal, controller.signal);
      return { ok: true, json: async () => ({ meals: [] }) };
    };
    await searchMeals("a", controller.signal);
  } finally {
    globalThis.fetch = original;
  }
});
