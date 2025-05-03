// Inkludera socket.io-klienten
const socket = io('http://localhost:5000');

// Lyssna på inkommande bokningsnotifikationer
socket.on('bookingNotification', (message) => {
  alert(message); // Visa notifikationen i användargränssnittet
});
