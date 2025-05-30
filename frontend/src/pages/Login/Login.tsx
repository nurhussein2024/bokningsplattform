import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Inloggningssida för användare
const Login = () => {
  const navigate = useNavigate();

  // Tillstånd för formulärdata
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Felmeddelande om något går fel
  const [error, setError] = useState("");

  // Uppdaterar formulärdata när användaren skriver
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hanterar formulärinlämningen
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Skicka en POST-förfrågan till backend för inloggning
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      // Om inloggningen misslyckas, kasta fel
      if (!response.ok) throw new Error(data.message || "Inloggning misslyckades");

      // Spara token i localStorage
      localStorage.setItem("token", data.token);

      // Skicka användaren till startsidan eller dashboard
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Logga in</h2>

        {/* Visa felmeddelande om det finns något */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Inloggningsformuläret */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="E-post"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Lösenord"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Logga in
          </button>
        </form>

        {/* Länk till registreringssidan */}
        <p className="text-sm text-center mt-4">
          Har du inget konto?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Registrera dig här
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
