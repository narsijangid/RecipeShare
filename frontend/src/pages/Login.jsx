import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { email, password } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAlert(null);
    clearError();
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    if (!email || !password) {
      setAlert('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    const success = await login(formData);
    setLoading(false);
    
    if (success) {
      navigate('/');
    } else {
      setAlert(error || 'Login failed');
    }
  };
  
  return (
    <div className="form-container">
      <h2 className="form-title">Login to Your Account</h2>
      
      {alert && (
        <div className="alert alert-danger">
          {alert}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            className="form-input"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            className="form-input"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Don't have an account? <Link to="/register" style={{ color: '#e74c3c' }}>Register</Link>
      </p>
    </div>
  );
};

export default Login;