import { Link } from "react-router-dom";
import { RecipeGrid } from "../components/RecipeCard";
import StatusMessage from "../components/StatusMessage";
export default function Favorites({ favorites }) {
  return (
    <section className="page-section">
      <p className="eyebrow">OMA RESEPTIKOKOELMASI</p>
      <h1>Suosikit</h1>
      <p className="page-intro">
        Hyvät löydöt talteen seuraavaa kokkaushetkeä varten.
      </p>
      <p className="storage-note">
        Suosikit ovat selain- ja laitekohtaisia. Ne eivät synkronoidu ja voivat
        kadota selaimen tietoja tyhjennettäessä. Reseptien tarkat tiedot
        tarvitsevat verkkoyhteyden.
      </p>
      {favorites.items.length ? (
        <RecipeGrid meals={favorites.items} favorites={favorites} />
      ) : (
        <>
          <StatusMessage title="Ei vielä suosikkeja">
            Etsi kiinnostava resepti ja paina Tallenna.
          </StatusMessage>
          <Link className="primary inline-link" to="/">
            Etsi reseptejä →
          </Link>
        </>
      )}
    </section>
  );
}
