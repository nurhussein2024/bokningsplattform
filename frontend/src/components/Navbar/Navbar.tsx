import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}> Bokningsplattform</div>
      <ul className={styles.navLinks}>
        <li><Link to="/">Hem</Link></li>
        <li><Link to="/login">Logga in</Link></li>
        <li><Link to="/bokningar">Bokningar</Link></li>
        <li><Link to="/rum">Rum</Link></li>
      </ul>
    </nav>
  );
};
