import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout
} from '../store/slices/authSlice';
import authService from '../services/auth/authService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    try {
      dispatch(loginStart());
      const data = await authService.login(credentials);
      dispatch(loginSuccess(data));
      navigate('/dashboard');
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  const handleRegister = async (userData) => {
    try {
      dispatch(registerStart());
      const data = await authService.register(userData);
      dispatch(registerSuccess(data));
      navigate('/dashboard');
    } catch (error) {
      dispatch(registerFailure(error.message));
    }
  };

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  };
}; 