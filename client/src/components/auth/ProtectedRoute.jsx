import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LessonForm from '../../components/LessonForm/LessonForm';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  return (
    <>
      {children}
      {showCreateForm && (
        <LessonForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </>
  );
};

export default ProtectedRoute; 