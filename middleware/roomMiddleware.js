// Middleware för att kontrollera om användaren är admin
// Detta middleware kontrollerar användarens roll i JWT-token och tillåter endast admin-användare
const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Endast admin har tillgång till denna funktion' });
  }
  next();
};

module.exports = { checkAdmin };
