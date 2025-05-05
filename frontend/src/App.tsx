import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar/Navbar";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";  

// Huvudkomponenten för hela frontend
function App() {
  return (
    <Router>
      {/* Navigeringsfältet som visas överst på alla sidor */}
      <Navbar />

      {/* Här definierar vi alla tillgängliga rutter i applikationen */}
      <Routes>
        <Route path="/" element={<div>Startsida</div>} />
        <Route path="/login" element={<Login />} /> {/* Logga in-sidan */}
        <Route path="/register" element={<Register />} /> {/* Registreringssida */}
        <Route path="/bokningar" element={<div>Bokningar</div>} />
        <Route path="/rum" element={<div>Rum</div>} />
      </Routes>
    </Router>
  );
}

export default App;
