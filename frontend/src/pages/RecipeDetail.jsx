import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RecipeContext from '../context/RecipeContext';
import AuthContext from '../context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipe, loading, getRecipe, deleteRecipe, toggleLike } = useContext(RecipeContext);
  const { user, isAuthenticated, toggleFavorite } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    getRecipe(id);
  }, [id]);
  
  useEffect(() => {
    if (recipe && user) {
      setIsLiked(recipe.likes.includes(user._id));
      setIsFavorite(user.favorites.includes(recipe._id));
    }
  }, [recipe, user]);
  
  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    await toggleLike(id);
    setIsLiked(!isLiked);
  };
  
  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    await toggleFavorite(id);
    setIsFavorite(!isFavorite);
  };
  
  const handleDelete = async () => {
    console.log('Delete button clicked, recipe id:', id);
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      console.log('Delete confirmed, proceeding...');
      const success = await deleteRecipe(id);
      console.log('Delete operation result:', success);
      if (success) {
        console.log('Delete successful, navigating to home...');
        navigate('/');
      } else {
        console.log('Delete failed, check console for errors');
      }
    } else {
      console.log('Delete cancelled');
    }
  };
  
  if (loading || !recipe) {
    return <p style={{ textAlign: 'center', margin: '2rem 0' }}>Loading recipe...</p>;
  }
  
  const isOwner = user && (recipe.user === user._id || recipe.user._id === user._id);
  
  return (
    <div className="recipe-detail">
      <div className="recipe-detail-content">
        <h1 className="recipe-detail-title">{recipe.title}</h1>
        <span className="recipe-detail-category">{recipe.category}</span>

        {recipe.image && (
          <div className="recipe-image-container">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="recipe-image"
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }}
            />
          </div>
        )}
        
        <div className="recipe-detail-section">
          <h2 className="recipe-detail-section-title">Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        
        <div className="recipe-detail-section">
          <h2 className="recipe-detail-section-title">Steps</h2>
          <ol className="steps-list">
            {recipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
        
        <div className="recipe-detail-footer">
          <div className="recipe-detail-likes">
            <button 
              className="recipe-detail-like-btn" 
              onClick={handleLike}
            >
              {isLiked ? (
                <img src="https://static.vecteezy.com/system/resources/previews/018/868/329/non_2x/red-heart-symbol-on-transparent-background-free-png.png" alt="Unlike" style={{width: '16px', height: '16px', marginRight: '5px', verticalAlign: 'middle'}} />
              ) : (
                <img src="https://static.vecteezy.com/system/resources/thumbnails/059/493/081/small/white-heart-clipart-free-png.png" alt="Like" style={{width: '16px', height: '16px', marginRight: '5px', verticalAlign: 'middle'}} />
              )}
              {isLiked ? 'Unlike' : 'Like'} ({recipe.likes.length})
            </button>
            
            <button 
              className="recipe-detail-like-btn" 
              onClick={handleFavorite}
              style={{ marginLeft: '10px' }}
            >
              {isFavorite ? '⭐ Unfavorite' : '☆ Favorite'}
            </button>
          </div>
          
          {isOwner && (
            <div className="recipe-detail-actions">
              <Link 
                to={`/edit-recipe/${recipe._id}`} 
                className="btn btn-primary"
              >
                Edit
              </Link>
              <button 
                onClick={handleDelete} 
                className="btn btn-primary"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;