import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar/Navbar";

// Huvudkomponenten för hela frontend
function App() {
  return (
    <Router>
      {/* Visa navigeringsfältet överst */}
      <Navbar />
      {/* Definiera olika rutter/sidor */}
      <Routes>
        <Route path="/" element={<div>Startsida</div>} />
        <Route path="/login" element={<div>Logga in</div>} />
        <Route path="/bokningar" element={<div>Bokningar</div>} />
        <Route path="/rum" element={<div>Rum</div>} />
      </Routes>
    </Router>
  );
}

export default App;
