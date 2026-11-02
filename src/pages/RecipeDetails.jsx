import { Link, useLocation, useParams } from "react-router-dom";
import { getMeal, categoryLabel } from "../services/mealdb";
import { useResource } from "../hooks/useResource";
import StatusMessage from "../components/StatusMessage";
import MealImage from "../components/MealImage";
import FavoriteButton from "../components/FavoriteButton";
export default function RecipeDetails({ favorites }) {
  const { id } = useParams();
  const location = useLocation();
  const result = useResource((signal) => getMeal(id, signal), [id]);
  const from = location.state?.from;
  const back =
    typeof from === "string" &&
    (from === "/favorites" || from === "/" || from.startsWith("/?"))
      ? from
      : "/";
  const meal = result.data;
  return (
    <section className="page-section">
      <Link className="back-link" to={back}>
        ← Takaisin resepteihin
      </Link>
      {result.status === "loading" ? (
        <StatusMessage title="Ladataan reseptiä…" />
      ) : result.status === "error" ? (
        <StatusMessage
          title="Reseptiä ei voitu ladata"
          retry={result.retry}
          error
        >
          Tarkista verkkoyhteytesi ja yritä uudelleen.
        </StatusMessage>
      ) : !meal ? (
        <StatusMessage title="Reseptiä ei löytynyt">
          Palaa hakuun ja valitse toinen resepti.
        </StatusMessage>
      ) : (
        <>
          <div className="detail-heading">
            <div>
              <p className="eyebrow">
                {categoryLabel(meal.category) || "Resepti"}
                {meal.area ? ` · ${meal.area}` : ""}
              </p>
              <h1>{meal.name}</h1>
            </div>
            <FavoriteButton meal={meal} favorites={favorites} />
          </div>
          <div className="detail-top">
            <MealImage key={meal.id} src={meal.image} name={meal.name} />
            <section className="ingredients">
              <h2>Ainesosat</h2>
              {meal.ingredients.length ? (
                <ul>
                  {meal.ingredients.map((ingredient, i) => (
                    <li key={i}>
                      <span>{ingredient.name}</span>
                      <strong>
                        {ingredient.amount || "Määrä ei saatavilla"}
                      </strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Ainesosia ei ole saatavilla.</p>
              )}
            </section>
          </div>
          <section className="instructions">
            <p className="eyebrow">AIKA KOKATA</p>
            <h2>Valmistusohje</h2>
            {meal.instructions ? (
              meal.instructions
                .split(/\r?\n/)
                .filter((line) => line.trim())
                .map((line, i) => <p key={i}>{line}</p>)
            ) : (
              <p>Valmistusohjetta ei ole saatavilla.</p>
            )}
          </section>
        </>
      )}
    </section>
  );
}
