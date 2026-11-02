export default function SearchForm({ value, onChange, onSearch, error }) {
  return (
    <form onSubmit={onSearch} className="search-form" role="search">
      <label htmlFor="recipe-search">Mitä tänään syötäisiin?</label>
      <div className="search-row">
        <input
          id="recipe-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Esimerkiksi chicken, pasta tai soup"
          aria-describedby={`search-help${error ? " search-error" : ""}`}
          aria-invalid={!!error}
        />
        <button className="primary" type="submit">
          Hae reseptejä <span aria-hidden="true">→</span>
        </button>
      </div>
      <p id="search-help">
        Hae englanninkielisellä reseptinimellä. Reseptien sisältö on
        englanniksi.
      </p>
      {error && (
        <p id="search-error" className="form-error" role="alert">
          Kirjoita hakusanaksi reseptin nimi.
        </p>
      )}
    </form>
  );
}
