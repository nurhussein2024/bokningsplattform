Detta är backend-delen för en bokningsplattform för ett coworking space. Projektet är byggt med Node.js, Express, MongoDB, Redis, JWT och WebSocket för att hantera användarautentisering, bokningar och realtidsnotifikationer.

Funktioner
🔐 Autentisering: Användare kan registrera sig, logga in och få en JWT-token för att autentisera sig vid API-anrop.

📅 Bokningar: Hantera bokningar av rum – skapa, uppdatera och ta bort bokningar.

🏢 Rumshantering: Administratörer kan skapa, uppdatera och ta bort rum.

📡 Realtidsnotifikationer: Användare får realtidsnotifikationer via WebSocket när en bokning skapas eller uppdateras.

👥 Rollbaserad åtkomst: Systemet skiljer på administratörer och vanliga användare med olika behörigheter.

Tekniker som används
Node.js – För serverhantering och backend-logik.

Express.js – För att skapa RESTful API:er.

MongoDB – För datalagring av användare, rum och bokningar.

Redis – För caching och sessionshantering.

WebSocket (Socket.io) – För realtidskommunikation.

JWT (JSON Web Tokens) – För autentisering och sessionshantering.

CORS – För att möjliggöra cross-origin-anrop.

Installation
Klona projektet:

bash
Kopiera
Redigera
git clone https://github.com/nurhussein2024/bokningsplattform.git
cd bokningsplattform
Installera beroenden:

bash
Kopiera
Redigera
npm install
Skapa .env-fil och fyll i dina miljövariabler, t.ex.:

ini
Kopiera
Redigera
PORT=5000
MONGO_URI=<din-mongodb-url>
JWT_SECRET=<ditt-hemliga-token>
REDIS_URL=redis://localhost:6379
Starta servern:

bash
Kopiera
Redigera
npm start
Testa projektet online 
Projektet är även distribuerat på Render så att du enkelt kan testa det utan lokal installation.

👉 Besök: https://bokningsplattform-4vb9.onrender.com/

Där kan du:

Skapa ett konto (registrera dig)

Logga in

Skapa, uppdatera eller ta bort bokningar

Få realtidsnotifikationer
 har du några frågor kontakta Nurhussein by Email in     nurhussein2003@yahoo.com
 
