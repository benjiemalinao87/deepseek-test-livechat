# LiveChat App

A real-time chat application built with React, Node.js, Socket.IO, and Twilio integration for SMS notifications.

## Project Structure

```
livechat-app/
├── backend/         # Node.js backend with Socket.IO and Twilio
└── frontend/        # React frontend with Chakra UI
```

## Features

- Real-time messaging using Socket.IO
- SMS notifications via Twilio
- Modern, responsive UI with Chakra UI
- Contact management with search functionality
- Dark/Light mode support
- Message status indicators (sent/delivered)
- Phone number-based user registration
- Message history display with timestamps
- Connection status indicators

## Technology Stack

### Frontend
- React 18.2.0
- Chakra UI for modern components
- Socket.IO Client 4.7.4
- Axios for HTTP requests

### Backend
- Node.js with Express
- Socket.IO for real-time communication
- Twilio SDK for SMS integration
- CORS enabled for secure cross-origin requests

## Getting Started

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
FRONTEND_URL=http://localhost:3000
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE=your_phone
```

4. Start the server:
```bash
npm start
```

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_TWILIO_PHONE=your_twilio_phone
```

4. Start development server:
```bash
npm start
```

## Deployment

The application is deployed on Railway with automatic deployments from GitHub:

1. Backend: https://livechat-app-production.up.railway.app
2. Frontend: https://livechat-app-frontend.up.railway.app

## Environment Variables

### Backend (.env)
```
FRONTEND_URL=<frontend-url>
TWILIO_ACCOUNT_SID=<twilio-sid>
TWILIO_AUTH_TOKEN=<twilio-token>
TWILIO_PHONE=<twilio-phone>
```

### Frontend (.env)
```
REACT_APP_API_URL=<backend-url>
REACT_APP_TWILIO_PHONE=<twilio-phone>
