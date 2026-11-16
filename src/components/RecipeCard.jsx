import { Link, useLocation } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import MealImage from "./MealImage";
import { categoryLabel } from "../services/mealdb";
export default function RecipeCard({ meal, favorites }) {
  const location = useLocation();
  return (
    <article className="recipe-card">
      <Link
        className="card-link"
        to={`/recipe/${meal.id}`}
        state={{ from: location.pathname + location.search }}
      >
        <MealImage src={meal.image} name={meal.name} />
        <div className="card-copy">
          <p className="eyebrow">
            {categoryLabel(meal.category) || "Resepti"}
            {meal.area ? ` · ${meal.area}` : ""}
          </p>
          <h3>{meal.name}</h3>
          <span className="recipe-open">
            Katso resepti <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
      <div className="card-footer">
        <FavoriteButton meal={meal} favorites={favorites} />
      </div>
    </article>
  );
}
export function RecipeGrid({ meals, favorites }) {
  return (
    <div className="recipe-grid">
      {meals.map((meal) => (
        <RecipeCard key={meal.id} meal={meal} favorites={favorites} />
      ))}
    </div>
  );
}
