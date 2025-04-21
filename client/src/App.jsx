import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Main Pages
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Lessons from './pages/Lessons/Lessons'
import Lesson from './pages/Lesson/Lesson';

// Protected Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProtectedLayout from './components/layout/ProtectedLayout';

// Placeholder components (to be implemented)
const Profile = () => <div>Profile (Coming Soon)</div>;

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Dashboard />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/lessons"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Lessons />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/lessons/:id"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Lesson />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Profile />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Redirect root to dashboard or login */}
            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
