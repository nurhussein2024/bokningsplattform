const request = require('supertest');
const appUrl = 'https://bokningsplattform-4vb9.onrender.com'; // Länk till din Render-app
let userToken = '';
let adminToken = '';
let roomId = '';
let bookingId = '';

describe('🧪 Tester för Bokningsplattformens API', () => {

  // Registrera en ny användare (kan vara testdata)
  test('✅ Registrera användare', async () => {
    const res = await request(appUrl)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: '123456' });

    expect([200, 201]).toContain(res.statusCode); // 201 = skapad, 200 om användaren redan finns
  });

  // Logga in som admin (måste redan finnas i databasen)
  test('✅ Logga in som admin', async () => {
    const res = await request(appUrl)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(res.statusCode).toBe(200);
    adminToken = res.body.token;
  });

  // Logga in som användare (Mariaplan)
  test('✅ Logga in som användare', async () => {
    const res = await request(appUrl)
      .post('/api/auth/login')
      .send({ username: 'Mariaplan', password: 'password1234' });

    expect(res.statusCode).toBe(200);
    userToken = res.body.token;
  });

  // Admin skapar ett nytt rum
  test('✅ Admin skapar ett rum', async () => {
    const res = await request(appUrl)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Rum',
        capacity: 6,
        type: 'conference'
      });

    expect(res.statusCode).toBe(201);
    roomId = res.body._id;
  });

  // Användare får inte skapa rum
  test('❌ Användare får inte skapa rum', async () => {
    const res = await request(appUrl)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Otillåtet Rum', capacity: 3, type: 'workspace' });

    expect(res.statusCode).toBe(403);
  });

  // Hämta alla rum
  test('✅ Hämta alla rum', async () => {
    const res = await request(appUrl)
      .get('/api/rooms')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Användare bokar ett rum
  test('✅ Användare skapar en bokning', async () => {
    const now = new Date();
    const start = new Date(now.getTime() + 3600000); // +1 timme
    const end = new Date(now.getTime() + 7200000);   // +2 timmar

    const res = await request(appUrl)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ roomId, startTime: start, endTime: end });

    expect(res.statusCode).toBe(201);
    bookingId = res.body._id;
  });

  // Samma tid får inte bokas igen
  test('❌ Dubbelbokning ska misslyckas', async () => {
    const now = new Date();
    const start = new Date(now.getTime() + 3600000);
    const end = new Date(now.getTime() + 7200000);

    const res = await request(appUrl)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ roomId, startTime: start, endTime: end });

    expect(res.statusCode).toBe(400); // Konflikt
  });

  // Användare hämtar sina egna bokningar
  test('✅ Användare hämtar sina bokningar', async () => {
    const res = await request(appUrl)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Admin ser alla bokningar
  test('✅ Admin hämtar alla bokningar', async () => {
    const res = await request(appUrl)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  // Användare uppdaterar sin bokning
  test('✅ Uppdatera bokning', async () => {
    const now = new Date();
    const start = new Date(now.getTime() + 10800000); // +3 timmar
    const end = new Date(now.getTime() + 14400000);   // +4 timmar

    const res = await request(appUrl)
      .put(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ startTime: start, endTime: end });

    expect(res.statusCode).toBe(200);
  });

  // Användare tar bort sin bokning
  test('✅ Radera bokning', async () => {
    const res = await request(appUrl)
      .delete(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  // Admin tar bort ett rum
  test('✅ Admin raderar rum', async () => {
    const res = await request(appUrl)
      .delete(`/api/rooms/${roomId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  // Ingen åtkomst utan token
  test('❌ Åtkomst utan token ska misslyckas', async () => {
    const res = await request(appUrl).get('/api/bookings');
    expect(res.statusCode).toBe(401);
  });

});
