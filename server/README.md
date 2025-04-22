# Language Learning Platform - Server

This is the backend server for the Language Learning Platform.

## Project Structure

```
server/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── logs/            # Application logs
│   └── app.js           # Main application file
├── .env                 # Environment variables
├── package.json         # Project dependencies
└── README.md           # Project documentation
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=4008
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Development

- Run in development mode:
  ```bash
  npm run dev
  ```

- Run tests:
  ```bash
  npm test
  ```

## Error Handling

The server uses a centralized error handling system. All errors are logged and appropriate responses are sent to the client.

## Security

- JWT authentication
- Password hashing
- Input validation
- Rate limiting
- CORS protection 