// Importera redis-biblioteket
const { createClient } = require('redis');

// Skapa en Redis-klient
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379' // Standardport
});

// Händelsehantering för fel
redisClient.on('error', (err) => {
  console.error('❌ Redis-fel:', err);
});

// Anslut till Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('✅ Ansluten till Redis');
  } catch (err) {
    console.error('❌ Kunde inte ansluta till Redis:', err);
  }
};

module.exports = {
  redisClient,
  connectRedis
};
