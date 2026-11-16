export default function FavoriteButton({ meal, favorites }) {
  const saved = favorites.has(meal.id);
  return (
    <button
      type="button"
      className={`favorite ${saved ? "saved" : ""}`}
      aria-pressed={saved}
      aria-label={`${saved ? "Poista suosikeista" : "Lisää suosikkeihin"}: ${meal.name}`}
      onClick={() => favorites.toggle(meal)}
    >
      <span aria-hidden="true">{saved ? "♥" : "♡"}</span>{" "}
      {saved ? "Tallennettu" : "Tallenna"}
    </button>
  );
}
