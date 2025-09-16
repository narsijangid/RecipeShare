import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import RecipeContext from '../context/RecipeContext';
import SkeletonRecipeCard from '../components/SkeletonRecipeCard';
import axios from 'axios';

const Profile = () => {
  const { user, isAuthenticated, loading: authLoading, logout } = useContext(AuthContext);
  const { getUserRecipes, userRecipes, loading: recipeLoading } = useContext(RecipeContext);
  const [activeTab, setActiveTab] = useState('myRecipes');
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated && user) {
      getUserRecipes();
      fetchFavoriteRecipes();
    }
  }, [isAuthenticated, user]);
  
  const fetchFavoriteRecipes = async () => {
    try {
      setLoadingFavorites(true);
      const res = await axios.get('https://recipeshare-cqxy.onrender.com/api/recipes/favorites');
      setFavoriteRecipes(res.data);
      setLoadingFavorites(false);
    } catch (err) {
      console.error('Error fetching favorite recipes:', err);
      setLoadingFavorites(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (authLoading || !user) {
    return <p style={{ textAlign: 'center', margin: '2rem 0' }}>Loading profile...</p>;
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <p>Member since {new Date(user.date).toLocaleDateString()}</p>
        </div>
        <button onClick={handleLogout} className="logout-profile-btn">
          <img src="https://cdn-icons-png.flaticon.com/512/450/450431.png" alt="Logout" style={{width: '16px', height: '16px', marginRight: '5px', verticalAlign: 'middle'}} />
          Logout
        </button>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'myRecipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('myRecipes')}
        >
          My Recipes
        </button>
        <button 
          className={`profile-tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites
        </button>
      </div>
      
      <div className="profile-content">
        {activeTab === 'myRecipes' ? (
          <div className="profile-recipes">
            <h2>My Recipes</h2>
            {recipeLoading ? (
              <div className="recipe-grid">
                {[...Array(4)].map((_, index) => (
                  <SkeletonRecipeCard key={index} />
                ))}
              </div>
            ) : userRecipes.length > 0 ? (
              <div className="recipe-grid">
                {userRecipes.map(recipe => (
                  <div className="recipe-card" key={recipe._id}>
                    {recipe.image && (
                      <div className="recipe-image-container">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title} 
                          className="recipe-image"
                          style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className="recipe-content">
                      <h3 className="recipe-title">{recipe.title}</h3>
                      <span className="recipe-category">{recipe.category}</span>
                      <div className="recipe-meta">
                        <div className="recipe-stats">
                          <span className="recipe-likes">
                            <img src="https://static.vecteezy.com/system/resources/previews/018/868/329/non_2x/red-heart-symbol-on-transparent-background-free-png.png" alt="Likes" style={{width: '14px', height: '14px', marginRight: '3px', verticalAlign: 'middle'}} />
                            <span>{recipe.likes.length}</span>
                          </span>
                        </div>
                      </div>
                      <Link to={`/recipes/${recipe._id}`} className="recipe-view-btn">
                        View Recipe
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't created any recipes yet.</p>
                <Link to="/create-recipe" className="btn btn-primary">
                  Create Your First Recipe
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="profile-favorites">
            <h2>Favorite Recipes</h2>
            {loadingFavorites ? (
            <div className="recipe-grid">
              {[...Array(4)].map((_, index) => (
                <SkeletonRecipeCard key={index} />
              ))}
            </div>
            ) : favoriteRecipes.length > 0 ? (
              <div className="recipe-grid">
                {favoriteRecipes.map(recipe => (
                  <div className="recipe-card" key={recipe._id}>
                    {recipe.image && (
                      <div className="recipe-image-container">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title} 
                          className="recipe-image"
                          style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className="recipe-content">
                      <h3 className="recipe-title">{recipe.title}</h3>
                      <span className="recipe-category">{recipe.category}</span>
                      <div className="recipe-meta">
                        <div className="recipe-stats">
                          <span className="recipe-likes">
                            <img src="https://static.vecteezy.com/system/resources/previews/018/868/329/non_2x/red-heart-symbol-on-transparent-background-free-png.png" alt="Likes" style={{width: '14px', height: '14px', marginRight: '3px', verticalAlign: 'middle'}} />
                            <span>{recipe.likes.length}</span>
                          </span>
                        </div>
                      </div>
                      <Link to={`/recipes/${recipe._id}`} className="recipe-view-btn">
                        View Recipe
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You don't have any favorite recipes yet.</p>
                <Link to="/recipes" className="btn btn-primary">
                  Browse Recipes
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;