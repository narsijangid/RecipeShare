import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeContext from '../context/RecipeContext';
import SkeletonRecipeCard from '../components/SkeletonRecipeCard';
import LatestRecipes from '../components/LatestRecipes';

const Home = () => {
  const { recipes, loading, getRecipes, getRecipesByCategory } = useContext(RecipeContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  useEffect(() => {
    getRecipes();
  }, []);

  useEffect(() => {
    setDisplayedRecipes(recipes);
    setCurrentPage(1); // Reset to first page when recipes change
  }, [recipes]);

  useEffect(() => {
    const handleRecipeSearch = (event) => {
      const { searchTerm: term, searchResults } = event.detail;
      setSearchTerm(term);
      setDisplayedRecipes(searchResults);
      setIsSearching(false);
    };

    window.addEventListener('recipeSearch', handleRecipeSearch);
    return () => window.removeEventListener('recipeSearch', handleRecipeSearch);
  }, []);
  
  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    setSearchTerm(''); // Clear search when changing category
    if (category === 'All') {
      getRecipes();
    } else {
      getRecipesByCategory(category);
    }
  };

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setDisplayedRecipes(recipes);
      setSearchTerm('');
      setCurrentPage(1);
      return;
    }

    setIsSearching(true);
    setSearchTerm(searchQuery);

    const searchResults = recipes.filter(recipe => {
      const titleMatch = recipe.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const descriptionMatch = recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const ingredientsMatch = recipe.ingredients?.some(ingredient => 
        ingredient.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return titleMatch || descriptionMatch || ingredientsMatch;
    });

    setDisplayedRecipes(searchResults);
    setCurrentPage(1);
    setIsSearching(false);
  };
  
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Other'];

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayedRecipes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayedRecipes.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button 
          className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        {totalPages > 1 && startPage > 1 && (
          <>
            <button className="pagination-btn" onClick={() => handlePageChange(1)}>1</button>
            {startPage > 2 && <span className="pagination-info">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
            onClick={() => handlePageChange(number)}
            disabled={totalPages === 1}
          >
            {number}
          </button>
        ))}
        
        {totalPages > 1 && endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-info">...</span>}
            <button className="pagination-btn" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
          </>
        )}
        
        <button 
          className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 1}
        >
          Next
        </button>
      </div>
    );
  };
  
  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', margin: '2rem 0' }}>Discover Delicious Recipes</h1>
      
      {/* Search Bar for Mobile */}
      <div className="mobile-search">
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => handleSearch('')}
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryFilter(category)}
            disabled={isSearching}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Search Results Header */}
      {searchTerm && (
        <div className="search-results-header">
          <h3>
            Search Results for "{searchTerm}" ({displayedRecipes.length} recipes)
          </h3>
          <button 
            className="clear-search-btn"
            onClick={() => handleSearch('')}
          >
            Clear Search
          </button>
        </div>
      )}
      
      {loading || isSearching ? (
        <div className="recipes-container">
          {[...Array(6)].map((_, index) => (
            <SkeletonRecipeCard key={index} />
          ))}
        </div>
      ) : displayedRecipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <h3>{searchTerm ? 'No recipes found' : 'No recipes found'}</h3>
            <p>
              {searchTerm 
                ? `No recipes match "${searchTerm}". Try different keywords.`
                : 'Be the first to add a recipe!'}
            </p>
            {!searchTerm && (
              <Link to="/create-recipe" className="btn btn-primary">
                Add Your First Recipe
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="recipes-container">
            {currentItems.map(recipe => (
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
          <div style={{ textAlign: 'center', margin: '1rem 0', color: '#666', fontSize: '0.9rem' }}>
            Page {currentPage} of {totalPages} • {displayedRecipes.length} total recipes
          </div>
          {renderPagination()}
          
          {/* Latest Recipes Section */}
          <LatestRecipes />
        </>
      )}
    </div>
  );
};

export default Home;