const jwt = require('jsonwebtoken');

// Middleware för att kontrollera JWT-token
const authenticateToken = (req, res, next) => {
  // Hämta token från "Authorization"-headern
  const authHeader = req.headers['authorization'];

  // Dela upp headern och extrahera själva token-delen (format: "Bearer token")
  const token = authHeader && authHeader.split(' ')[1];

  // Om ingen token skickats med, returnera 401
  if (!token) {
    return res.status(401).json({ message: 'Ingen token angiven' });
  }

  try {
    // Verifiera token med hemlig nyckel (JWT_SECRET från .env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Spara användarinformationen i req.user för kommande middleware eller routes
    req.user = decoded;

    // Fortsätt till nästa middleware/route
    next();
  } catch (err) {
    // Logga felet i konsolen för felsökning
    console.error('Tokenverifiering misslyckades:', err.message);

    // Returnera 401 om token är ogiltig eller utgången
    return res.status(401).json({ message: 'Ogiltig token' });
  }
};

// Middleware för att endast tillåta administratörer
const authorizeAdmin = (req, res, next) => {
  // Kontrollera att den inloggade användaren har rollen "Admin"
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Endast admin har tillgång' });
  }

  // Fortsätt till nästa middleware/route
  next();
};

module.exports = {
  authenticateToken,
  authorizeAdmin
};
