import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
import { useAuth } from "../contexts/FakeAuthContext";

function PageNav() {
  const { isAuthenticated, logout } = useAuth();

  function handleClick() {
    if (isAuthenticated) logout();
  }
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li>
          <NavLink
            className={styles.ctaLink}
            to={!isAuthenticated && "/login"}
            onClick={handleClick}
          >
            {!isAuthenticated ? "Log in" : "Log out"}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
