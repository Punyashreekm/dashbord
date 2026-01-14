# Dashboard Assignment

A full-stack dashboard application with user authentication and task management, built with React (frontend) and Node.js/Express (backend) with MongoDB.

## Links

- [GitHub Repository](https://github.com/Punyashreekm/dashbord)


## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a MongoDB Atlas account)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd assignment
   ```

2. Install backend dependencies:
   ```
   cd dashboard-backend
   npm install
   create .env file and copy the env.example
   ```

3. Install frontend dependencies:
   ```
   cd ../dashboard-frontend
   npm install
   create .env file and copy the env.example
   ```

4. Set up environment variables:
   - Create a `.env` file in the `dashboard-backend` directory
   - Add your MongoDB connection string:
     ```
     MONGO_URI=mongodb://localhost:27017/dashboard-db
     ```
     Or use MongoDB Atlas: `MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dashboard-db`
   - Add JWT secret:
     ```
     JWT_SECRET=your-secret-key
     ```

## Running the Application

1. Start the backend server:
   ```
   cd dashboard-backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000` (or check the console output).

2. Start the frontend development server:
   ```
   cd ../dashboard-frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or check the console output).

3. Open your browser and navigate to the frontend URL to use the application.

## Available Scripts

### Backend
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Features

- User registration and login
- JWT-based authentication
- Task management (create, read, update, delete)
- Protected routes
- Responsive UI with Tailwind CSS
