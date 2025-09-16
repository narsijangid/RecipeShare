import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeContext from '../context/RecipeContext';
import SkeletonRecipeCard from '../components/SkeletonRecipeCard';

const Home = () => {
  const { recipes, loading, getRecipes, getRecipesByCategory } = useContext(RecipeContext);
  const [activeCategory, setActiveCategory] = useState('All');
  
  useEffect(() => {
    getRecipes();
  }, []);
  
  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      getRecipes();
    } else {
      getRecipesByCategory(category);
    }
  };
  
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Other'];
  
  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', margin: '2rem 0' }}>Discover Delicious Recipes</h1>
      
      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="recipes-container">
          {[...Array(6)].map((_, index) => (
            <SkeletonRecipeCard key={index} />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <p style={{ textAlign: 'center', margin: '2rem 0' }}>No recipes found. Be the first to add one!</p>
      ) : (
        <div className="recipes-container">
          {recipes.map(recipe => (
            <div key={recipe._id} className="recipe-card">
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
      )}
    </div>
  );
};

export default Home;