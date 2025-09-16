import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
   
    const token = localStorage.getItem('token');
    
    if (token) {
    
      setAuthToken(token);
      
      try {
      
        const decoded = jwtDecode(token);
        
       
        if (decoded.exp * 1000 < Date.now()) {
       
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setAuthToken(false);
        } else {
         
          setToken(token);
          loadUser();
        }
      } catch (err) {
     
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setAuthToken(false);
      }
    } else {
      setLoading(false);
    }
  }, []);


  const loadUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/me');
      setUser(res.data);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (err) {
      localStorage.removeItem('token');
      setAuthToken(false);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError(err.response?.data?.msg || 'Authentication error');
      setLoading(false);
    }
  };

 
  const register = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      const token = res.data.token;
      localStorage.setItem('token', token);
      setAuthToken(token);
      setToken(token);
      await loadUser();
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      return false;
    }
  };


  const login = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      const token = res.data.token;
      localStorage.setItem('token', token);
      setAuthToken(token);
      setToken(token);
      await loadUser();
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      return false;
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(false);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };


  const toggleFavorite = async (recipeId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/users/favorites/${recipeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...user, favorites: res.data });
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update favorites');
      return false;
    }
  };


  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        toggleFavorite,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;