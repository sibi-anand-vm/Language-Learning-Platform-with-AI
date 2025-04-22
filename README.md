# AI Learning Platform

A language learning application with AI-powered features for personalized learning experiences.

## Project Structure

```
.
├── client/          # Frontend React application
├── server/          # Backend Node.js/Express server
└── README.md        # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (running locally or accessible via connection string)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AILearningPlatform
```

### 2. Set Up the Server

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create a .env file with the following variables:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# PORT=5000

# Start the server
npm start
```

The server will run on http://localhost:4008 by default.

### 3. Set Up the Client

```bash
# Open a new terminal
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The client will run on http://localhost:5173 by default.

## Features

- User authentication and authorization
- Personalized learning paths
- Progress tracking
- Interactive lessons
- AI-powered feedback
- User statistics and analytics

## Development

- Server runs on port 4008
- Client runs on port 5173
- API endpoints are prefixed with `/api`
- JWT authentication is required for protected routes

## Troubleshooting

If you encounter any issues:

1. Ensure MongoDB is running and accessible
2. Check that all environment variables are properly set
3. Verify that all dependencies are installed
4. Check the console for any error messages

