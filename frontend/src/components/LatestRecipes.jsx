import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeContext from '../context/RecipeContext';

const LatestRecipes = () => {
  const { recipes } = useContext(RecipeContext);
  const [randomRecipes, setRandomRecipes] = useState([]);

  useEffect(() => {
    if (recipes.length > 0) {
      // Get 6 random recipes
      const getRandomRecipes = () => {
        const shuffled = [...recipes].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 6);
      };
      
      setRandomRecipes(getRandomRecipes());
    }
  }, [recipes]);

  if (randomRecipes.length === 0) {
    return null;
  }

  return (
    <div className="latest-recipes-section">
      <h2 className="section-title">Latest Recipes</h2>
      <div className="latest-recipes-grid">
        {randomRecipes.map((recipe) => (
          <div key={recipe._id} className="recipe-card">
            {recipe.image && (
              <div className="recipe-image-container">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="recipe-image"
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
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
                  <span>{recipe.ingredients.length} ingredients</span>
                  <span>{recipe.steps.length} steps</span>
                </div>
              </div>
              <Link to={`/recipes/${recipe._id}`} className="recipe-view-btn">
                View Recipe
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestRecipes;