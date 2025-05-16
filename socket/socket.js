// Inkludera socket.io-klienten och anslut till rätt backend-URL
const socket = io('https://bokningsplattform-4vb9.onrender.com');

// Lyssna på inkommande bokningsnotifikationer
socket.on('bookingNotification', (message) => {
  alert(message); // Visa notifikationen i användargränssnittet
});
