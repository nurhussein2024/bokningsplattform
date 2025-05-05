import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Registreringssida för nya användare
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  // Hanterar inmatningsändringar
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Skickar registreringsförfrågan till servern
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Registrering misslyckades");

      navigate("/login"); // Skickar användaren till inloggningssidan
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Skapa konto</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Namn"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
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
            Registrera
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Har du redan ett konto? <a href="/login" className="text-blue-600 hover:underline">Logga in här</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
