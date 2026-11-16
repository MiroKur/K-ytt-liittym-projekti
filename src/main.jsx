import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import RecipeDetails from "./pages/RecipeDetails";
import { useFavorites } from "./hooks/useFavorites";
import "./styles/main.css";
function App() {
  const favorites = useFavorites();
  const { pathname } = useLocation();
  useEffect(() => {
    document.getElementById("main-content")?.focus();
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content").focus();
        }}
      >
        Siirry sisältöön
      </a>
      <Navigation count={favorites.items.length} />
      <main id="main-content" tabIndex="-1">
        <div className="sr-only" role="status">
          {favorites.announcement}
        </div>
        {favorites.warning && (
          <div className="storage-warning" role="alert">
            {favorites.warning}
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home favorites={favorites} />} />
          <Route
            path="/favorites"
            element={<Favorites favorites={favorites} />}
          />
          <Route
            path="/recipe/:id"
            element={<RecipeDetails favorites={favorites} />}
          />
          <Route
            path="*"
            element={
              <section className="page-section">
                <h1>Sivua ei löytynyt</h1>
                <Link to="/">Palaa etusivulle</Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer>
        <span className="footer-brand">
          RecipeBox <span>· Ruokaideoita arkeen.</span>
        </span>
        <span>
          Reseptit ja kuvat: <a href="https://www.themealdb.com/">TheMealDB</a>
        </span>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
