import { useState } from "react";
import { safeImage } from "../services/mealdb";
const KEY = "recipebox.favorites.v1";
const WARNING =
  "Suosikkeja ei voitu tallentaa selaimeen. Muutokset säilyvät vain tämän käyttökerran ajan.";
function initialState() {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === null) return { items: [], warning: "" };
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error("Invalid favorites");
    const seen = new Set();
    const items = parsed
      .filter((item) => {
        if (
          !item ||
          typeof item.id !== "string" ||
          !/^\d+$/.test(item.id) ||
          typeof item.name !== "string" ||
          !item.name.trim() ||
          seen.has(item.id)
        )
          return false;
        seen.add(item.id);
        return true;
      })
      .map((item) => ({
        id: item.id,
        name: item.name,
        image: safeImage(item.image),
      }));
    return {
      items,
      warning:
        items.length !== parsed.length
          ? "Osa tallennetuista suosikeista oli viallisia ja ohitettiin."
          : "",
    };
  } catch {
    return {
      items: [],
      warning:
        "Tallennettuja suosikkeja ei voitu lukea. Voit silti käyttää sovellusta.",
    };
  }
}
export function useFavorites() {
  const [state, setState] = useState(initialState);
  const [announcement, setAnnouncement] = useState("");
  function toggle(meal) {
    const exists = state.items.some((item) => item.id === meal.id);
    const items = exists
      ? state.items.filter((item) => item.id !== meal.id)
      : [...state.items, { id: meal.id, name: meal.name, image: meal.image }];
    let warning = "";
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      warning = WARNING;
    }
    setState({ items, warning });
    setAnnouncement(
      `${meal.name} ${exists ? "poistettu suosikeista" : "lisätty suosikkeihin"}.`,
    );
  }
  return {
    ...state,
    toggle,
    announcement,
    has: (id) => state.items.some((item) => item.id === id),
  };
}
