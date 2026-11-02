import { NavLink } from "react-router-dom";
export default function Navigation({ count }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="brand" aria-label="RecipeBox etusivu">
          <span className="brand-icon" aria-hidden="true">
            r.
          </span>
          Recipe<span>Box</span>
        </NavLink>
        <nav aria-label="Päänavigaatio">
          <NavLink to="/" end>
            Reseptit
          </NavLink>
          <NavLink to="/favorites">
            Suosikit <span className="count">{count}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
