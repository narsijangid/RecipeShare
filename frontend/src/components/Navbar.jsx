import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import SearchBar from './searchbar';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSearch = (searchResults) => {
    // Search results will be handled by Home page directly
    // No navigation needed
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img 
            src="https://static.vecteezy.com/system/resources/previews/055/385/963/non_2x/chef-hat-and-spoons-isometric-render-png.png" 
            alt="Recipe Logo" 
            style={{width: '30px', height: '30px', marginRight: '10px'}} 
          />
          RecipeShare
        </Link>
        
        {/* Desktop Search Bar */}
        <div className="desktop-search">
          <SearchBar onSearch={handleSearch} placeholder="Search recipes, ingredients..." />
        </div>
        
        <div className="hamburger" onClick={toggleMenu}>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </div>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>
              <img src="https://static.vecteezy.com/system/resources/thumbnails/014/391/893/small_2x/home-icon-isolated-on-transparent-background-black-symbol-for-your-design-free-png.png" alt="Home" className="nav-icon" style={{width: '20px', height: '20px', marginRight: '0.5rem'}} />
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/recipes" className="nav-link" onClick={closeMenu}>
              <img src="https://static.thenounproject.com/png/2434646-200.png" alt="Recipes" className="nav-icon" style={{width: '20px', height: '20px', marginRight: '0.5rem'}} />
              Recipes
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/create-recipe" className="nav-link" onClick={closeMenu}>
                  <img src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png" alt="Create Recipe" className="nav-icon" style={{width: '20px', height: '20px', marginRight: '0.5rem'}} />
                  Create Recipe
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link" onClick={closeMenu}>
                  <img src="https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png" alt="Profile" className="nav-icon" style={{width: '20px', height: '20px', marginRight: '0.5rem'}} />
                  Profile
                </Link>
              </li>

            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={closeMenu}>
                  <img src="https://cdn-icons-png.flaticon.com/512/310/310818.png" alt="Login" className="nav-icon" style={{width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle'}} />
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link" onClick={closeMenu}>
                  <img src="https://cdn-icons-png.flaticon.com/512/562/562929.png" alt="Register" className="nav-icon" style={{width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle'}} />
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;