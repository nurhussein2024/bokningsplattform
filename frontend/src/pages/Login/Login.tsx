import { useState } from "react";
import styles from "./Login.module.css";

// Komponent för inloggningssidan
export const Login = () => {
  // Lokalt tillstånd för e-post och lösenord
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Funktion som körs när formuläret skickas
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // För tillfället - logga inmatade värden
    console.log("Inloggning:", { email, password });

    // TODO: Skicka förfrågan till backend för autentisering
  };

  return (
    <div className={styles.loginContainer}>
      {/* Rubrik för sidan */}
      <h2>Logga in</h2>

      {/* Inloggningsformulär */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Fält för e-post */}
        <label>
          E-post:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {/* Fält för lösenord */}
        <label>
          Lösenord:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {/* Skicka-knapp */}
        <button type="submit">Logga in</button>
      </form>
    </div>
  );
};
