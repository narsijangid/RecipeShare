import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { name, email, password, password2 } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAlert(null);
    clearError();
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      setAlert('Please fill in all fields');
      return;
    }
    
    if (password !== password2) {
      setAlert('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setAlert('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    const success = await register({
      name,
      email,
      password
    });
    setLoading(false);
    
    if (success) {
      navigate('/');
    } else {
      setAlert(error || 'Registration failed');
    }
  };
  
  return (
    <div className="form-container">
      <h2 className="form-title">Create Your Account</h2>
      
      {alert && (
        <div className="alert alert-danger">
          {alert}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            className="form-input"
            placeholder="Enter your name"
            required
          />
        </div>
        
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
        
        <div className="form-group">
          <label htmlFor="password2" className="form-label">Confirm Password</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={onChange}
            className="form-input"
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>
      
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login" style={{ color: '#e74c3c' }}>Login</Link>
      </p>
    </div>
  );
};

export default Register;