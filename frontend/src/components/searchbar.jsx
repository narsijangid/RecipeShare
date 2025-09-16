import { useState, useContext } from 'react';
import RecipeContext from '../context/RecipeContext';
import './searchbar.css';

const SearchBar = ({ onSearch, placeholder = "Search recipes..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { recipes } = useContext(RecipeContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);

    try {
      // Filter recipes based on search term
      const searchResults = recipes.filter(recipe => {
        const titleMatch = recipe.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const descriptionMatch = recipe.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const ingredientsMatch = recipe.ingredients?.some(ingredient => 
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return titleMatch || descriptionMatch || ingredientsMatch;
      });

      // Emit search event for Home page to handle
      window.dispatchEvent(new CustomEvent('recipeSearch', {
        detail: { searchResults, searchTerm }
      }));

      if (onSearch) onSearch(searchResults);

      setIsSearching(false);
    } catch (error) {
      console.error('Search error:', error);
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (!onSearch) {
      window.dispatchEvent(new CustomEvent('recipeSearch', {
        detail: { searchTerm: '', searchResults: recipes }
      }));
    }
  };

  return (
    <form className="search-bar-container" onSubmit={handleSearch}>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search recipes"
        />

        <button
          type="submit"
          className="search-submit-btn"
          disabled={isSearching || !searchTerm.trim()}
          aria-label="Search"
        >
          {isSearching ? (
            <div className="search-spinner"></div>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;