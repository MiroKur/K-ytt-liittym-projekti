import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  searchMeals,
  filterMeals,
  getCategories,
  categoryLabel,
} from "../services/mealdb";
import { useResource } from "../hooks/useResource";
import SearchForm from "../components/SearchForm";
import CategorySelect from "../components/CategorySelect";
import StatusMessage from "../components/StatusMessage";
import { RecipeGrid } from "../components/RecipeCard";
export default function Home({ favorites }) {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const category = params.get("category") || "";
  const [value, setValue] = useState(query);
  const [invalid, setInvalid] = useState(false);
  useEffect(() => {
    setValue(query);
    setInvalid(false);
  }, [query, category]);
  const categories = useResource(getCategories, []);
  const recipes = useResource(
    (signal) =>
      category
        ? filterMeals(category, signal)
        : query
          ? searchMeals(query, signal)
          : Promise.resolve([]),
    [query, category],
  );
  function search(event) {
    event.preventDefault();
    if (!value.trim()) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    if (query === value.trim() && !category) recipes.retry();
    else setParams({ q: value.trim() });
  }
  function chooseCategory(next) {
    setValue("");
    setInvalid(false);
    setParams(next ? { category: next } : {});
  }
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">PIENI INSPIRAATIO. HYVÄÄ RUOKAA.</p>
          <h1>
            Seuraava lempiruokasi
            <br />
            <em>löytyy täältä.</em>
          </h1>
          <p>
            Uusia ideoita arkeen ja herkkuja viikonloppuun.
            <br />
            Löydä resepti ja säilytä suosikkisi yhdessä paikassa.
          </p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="plate">
            <div className="leaf leaf-one"></div>
            <div className="leaf leaf-two"></div>
            <div className="tomato"></div>
            <div className="tomato small"></div>
            <div className="pasta">≈</div>
          </div>
          <span className="art-note">Hyvä ruoka alkaa ideasta.</span>
        </div>
      </section>
      <section className="discovery" aria-label="Reseptien etsiminen">
        <SearchForm
          value={value}
          onChange={setValue}
          onSearch={search}
          error={invalid}
        />
        <CategorySelect
          categories={categories.data || []}
          value={category}
          onChange={chooseCategory}
          disabled={categories.status === "loading"}
        />
        {categories.status === "error" && (
          <StatusMessage
            title="Kategorioita ei voitu ladata"
            retry={categories.retry}
            error
          >
            Nimihaku on edelleen käytettävissä.
          </StatusMessage>
        )}
      </section>
      <section className="results" aria-labelledby="results-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OMA LÖYTÖRETKESI</p>
            <h2 id="results-title">
              {category
                ? categoryLabel(category)
                : query
                  ? `Hakutulokset: ${query}`
                  : "Mistä aloitetaan?"}
            </h2>
          </div>
          {(query || category) && recipes.status === "success" && (
            <span role="status">{recipes.data.length} reseptiä</span>
          )}
        </div>
        {!query && !category ? (
          <div className="welcome">
            <span className="welcome-symbol" aria-hidden="true">
              ✳
            </span>
            <h3>Jotain tuttua vai aivan uutta?</h3>
            <p>
              Kirjoita reseptin nimi tai valitse kategoria.
              <br />
              Tallenna parhaat löydöt sydänpainikkeella.
            </p>
            <div className="suggestions">
              {["Chicken", "Pasta", "Vegetarian"].map((item) => (
                <button key={item} onClick={() => chooseCategory(item)}>
                  {categoryLabel(item)} <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </div>
        ) : recipes.status === "loading" ? (
          <StatusMessage title="Haetaan reseptejä…" />
        ) : recipes.status === "error" ? (
          <StatusMessage
            title="Reseptien haku epäonnistui"
            retry={recipes.retry}
            error
          >
            Tarkista verkkoyhteytesi ja yritä uudelleen.
          </StatusMessage>
        ) : recipes.data.length ? (
          <RecipeGrid meals={recipes.data} favorites={favorites} />
        ) : (
          <StatusMessage title="Reseptejä ei löytynyt">
            Kokeile toista englanninkielistä hakusanaa tai valitse kategoria.
          </StatusMessage>
        )}
      </section>
    </>
  );
}
