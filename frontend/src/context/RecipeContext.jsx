import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const getRecipes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://recipeshare-cqxy.onrender.com/api/recipes');
      setRecipes(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch recipes');
      setLoading(false);
    }
  };


  const getRecipesByCategory = async (category) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://recipeshare-cqxy.onrender.com/api/recipes/category/${category}`);
      setRecipes(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch recipes');
      setLoading(false);
    }
  };


  const getRecipe = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://recipeshare-cqxy.onrender.com/api/recipes/${id}`);
      setRecipe(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch recipe');
      setLoading(false);
    }
  };


  const createRecipe = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('https://recipeshare-cqxy.onrender.com/api/recipes', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes([res.data, ...recipes]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create recipe');
      return null;
    }
  };

  
  const updateRecipe = async (id, formData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Updating recipe with data:', formData);
      const res = await axios.put(`https://recipeshare-cqxy.onrender.com/api/recipes/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Update response:', res.data);
      setRecipes(recipes.map(recipe => recipe._id === id ? res.data : recipe));
      if (recipe && recipe._id === id) {
        setRecipe(res.data);
      }
      return res.data;
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to update recipe');
      return null;
    }
  };


  const deleteRecipe = async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Deleting recipe with id:', id);
      await axios.delete(`https://recipeshare-cqxy.onrender.com/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Recipe deleted successfully');
      setRecipes(recipes.filter(recipe => recipe._id !== id));
      return true;
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to delete recipe');
      return false;
    }
  };


  const toggleLike = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`https://recipeshare-cqxy.onrender.com/api/recipes/like/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(recipes.map(recipe => {
        if (recipe._id === id) {
          return { ...recipe, likes: res.data };
        }
        return recipe;
      }));
      
      if (recipe && recipe._id === id) {
        setRecipe({ ...recipe, likes: res.data });
      }
      
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update like status');
      return false;
    }
  };


  const getUserRecipes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('https://recipeshare-cqxy.onrender.com/api/recipes/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserRecipes(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch your recipes');
      setLoading(false);
    }
  };


  const clearError = () => setError(null);

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        userRecipes,
        recipe,
        loading,
        error,
        getRecipes,
        getRecipesByCategory,
        getRecipe,
        getUserRecipes,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        toggleLike,
        clearError
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeContext;