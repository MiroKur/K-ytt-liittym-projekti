import { categoryLabel } from "../services/mealdb";
export default function CategorySelect({
  categories,
  value,
  onChange,
  disabled,
}) {
  return (
    <div className="category-select">
      <label htmlFor="category">Tai selaa kategorioita</label>
      <select
        id="category"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="">Valitse kategoria</option>
        {categories.map((category) => (
          <option value={category} key={category}>
            {categoryLabel(category)}
          </option>
        ))}
      </select>
    </div>
  );
}
