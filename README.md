# Bokningsplattform - Backend för Coworking Space

Detta är backend-delen för en bokningsplattform för ett coworking space. Projektet är byggt med Node.js, Express, MongoDB, Redis, JWT och WebSocket för att hantera användarautentisering, bokningar och realtidsnotifikationer.

## Funktioner
- **Autentisering**: Användare kan registrera sig, logga in och få JWT-token för att autentisera sig vid API-anrop.
- **Bokningar**: Hantera bokningar av rum, inklusive skapande, uppdatering och borttagning.
- **Rumshantering**: Möjlighet att skapa, uppdatera och ta bort rum.
- **Realtidsnotifikationer**: Användare får realtidsnotifikationer när en bokning görs eller uppdateras via WebSocket.
- **Rollbaserad åtkomst**: Admin och användare har olika behörigheter.
  
## Tekniker som används
- **Node.js**: För serverhantering och backend-logik.
- **Express.js**: För att skapa API-rutter.
- **MongoDB**: För datalagring av användare, rum och bokningar.
- **Redis**: För cachning och sessionhantering.
- **WebSocket (Socket.io)**: För att hantera realtidskommunikation.
- **JWT**: För användarautentisering och sessionshantering.
- **Cors**: För att hantera cross-origin requests.
  
## Installation

1. **Klona projektet**:
   ```bash
   git clone https://github.com/nurhussein2024/bokningsplattform.git
