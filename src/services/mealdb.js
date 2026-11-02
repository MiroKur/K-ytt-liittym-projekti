// Public educational test key, not a secret. See docs/API.md before publishing.
const BASE = "https://www.themealdb.com/api/json/v1/1/";
const text = (value) => (typeof value === "string" ? value.trim() : "");
export function safeImage(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}
export function normalizeMeal(raw) {
  if (!raw || !/^\d+$/.test(text(raw.idMeal)) || !text(raw.strMeal))
    return null;
  return {
    id: raw.idMeal,
    name: text(raw.strMeal),
    image: safeImage(raw.strMealThumb),
    category: text(raw.strCategory),
    area: text(raw.strArea),
    instructions: text(raw.strInstructions),
    ingredients: Array.from({ length: 20 }, (_, i) => ({
      name: text(raw[`strIngredient${i + 1}`]),
      amount: text(raw[`strMeasure${i + 1}`]),
    })).filter((item) => item.name),
  };
}
async function request(path, signal) {
  const response = await fetch(BASE + path, { signal });
  if (!response.ok)
    throw new Error("Reseptipalveluun ei saatu yhteyttä. Yritä uudelleen.");
  const data = await response.json();
  if (!data || typeof data !== "object")
    throw new Error("Reseptipalvelu palautti virheellisiä tietoja.");
  return data;
}
async function meals(path, signal) {
  const data = await request(path, signal);
  if (data.meals === null) return [];
  if (!Array.isArray(data.meals))
    throw new Error("Reseptipalvelun vastausta ei voitu lukea.");
  return data.meals.map(normalizeMeal).filter(Boolean);
}
export const searchMeals = (query, signal) =>
  meals(`search.php?s=${encodeURIComponent(query)}`, signal);
export const filterMeals = (category, signal) =>
  meals(`filter.php?c=${encodeURIComponent(category)}`, signal);
export const getMeal = async (id, signal) =>
  (await meals(`lookup.php?i=${encodeURIComponent(id)}`, signal))[0] ?? null;
export async function getCategories(signal) {
  const data = await request("categories.php", signal);
  if (!Array.isArray(data.categories))
    throw new Error("Kategorioita ei voitu lukea.");
  return [
    ...new Set(
      data.categories.map((item) => text(item?.strCategory)).filter(Boolean),
    ),
  ];
}
export const categoryLabels = {
  Beef: "Naudanliha",
  Breakfast: "Aamiainen",
  Chicken: "Kana",
  Dessert: "Jälkiruoat",
  Goat: "Vuohi",
  Lamb: "Lammas",
  Miscellaneous: "Muut",
  Pasta: "Pasta",
  Pork: "Porsaanliha",
  Seafood: "Kala ja äyriäiset",
  Side: "Lisukkeet",
  Starter: "Alkuruoat",
  Vegan: "Vegaaninen",
  Vegetarian: "Kasvisruoka",
};
export const categoryLabel = (value) => categoryLabels[value] || value;
