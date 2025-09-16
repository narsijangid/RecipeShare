import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import RecipeContext from '../context/RecipeContext';
import AuthContext from '../context/AuthContext';
import { uploadImageToCloudinary } from '../config/cloudinary';

const CreateRecipe = () => {
  const { createRecipe, updateRecipe, getRecipe, recipe, loading: recipeLoading } = useContext(RecipeContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Breakfast',
    ingredients: [''],
    steps: [''],
    image: '',
    imagePublicId: ''
  });
  
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const { title, category, ingredients, steps, image } = formData;
  
 
  useEffect(() => {
    if (isEditMode) {
      const loadRecipe = async () => {
        setLoading(true);
        console.log('Loading recipe for edit, id:', id);
      
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}?t=${Date.now()}`);
        console.log('Fresh recipe data:', res.data);
        setRecipe(res.data); 
        setFormData({
          title: res.data.title || '',
          category: res.data.category || 'Breakfast',
          ingredients: res.data.ingredients && res.data.ingredients.length > 0 ? res.data.ingredients : [''],
          steps: res.data.steps && res.data.steps.length > 0 ? res.data.steps : [''],
          image: res.data.image || '',
          imagePublicId: res.data.imagePublicId || ''
        });
        setPreviewImage(res.data.image || null);
        setLoading(false);
      };
      loadRecipe();
    } else {

      setFormData({
          title: '',
          category: 'Breakfast',
          ingredients: [''],
          steps: [''],
          image: '',
          imagePublicId: ''
        });
        setPreviewImage(null);
    }
  }, [isEditMode, id]);
  

  

  useEffect(() => {
    if (isEditMode) {
      window.scrollTo(0, 0);
    }
  }, [isEditMode]);
  

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  

  if (isEditMode && (loading || recipeLoading) && !recipe) {
    return <p style={{ textAlign: 'center', margin: '2rem 0' }}>Loading recipe...</p>;
  }
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAlert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setAlert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.post('http://localhost:5000/api/recipes/upload-image', 
            { image: event.target.result }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (res.data.success) {
            setFormData({
              ...formData,
              image: res.data.imageUrl,
              imagePublicId: res.data.publicId
            });
            setPreviewImage(res.data.imageUrl);
            setAlert(null);
          } else {
            setAlert('Failed to upload image');
          }
        } catch (err) {
          console.error('Image upload error:', err);
          setAlert('Error uploading image. Please try again.');
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File reading error:', err);
      setAlert('Error reading file. Please try again.');
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: '',
      imagePublicId: ''
    });
    setPreviewImage(null);
  };
  
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };
  
  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...ingredients, ''] });
  };
  
  const removeIngredient = index => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setFormData({ ...formData, ingredients: newIngredients });
    }
  };
  
  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };
  
  const addStep = () => {
    setFormData({ ...formData, steps: [...steps, ''] });
  };
  
  const removeStep = index => {
    if (steps.length > 1) {
      const newSteps = [...steps];
      newSteps.splice(index, 1);
      setFormData({ ...formData, steps: newSteps });
    }
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    setAlert('');
    
    if (!title || !title.trim()) {
      setAlert('Title is required');
      return;
    }
    
    
    if (!isEditMode && !formData.image) {
      setAlert('Recipe image is required');
      return;
    }
    
    const filteredIngredients = ingredients.filter(ingredient => ingredient && ingredient.trim());
    const filteredSteps = steps.filter(step => step && step.trim());
    
    if (filteredIngredients.length === 0) {
      setAlert('At least one ingredient is required');
      return;
    }
    
    if (filteredSteps.length === 0) {
      setAlert('At least one step is required');
      return;
    }
    
    const recipeData = {
      title: title.trim(),
      category,
      ingredients: filteredIngredients,
      steps: filteredSteps,
      image: formData.image,
      imagePublicId: formData.imagePublicId
    };
    
    console.log('Submitting recipe data:', recipeData);
    
    let result;
    if (isEditMode) {
      console.log('Updating recipe with id:', id);
      result = await updateRecipe(id, recipeData);
      console.log('Update result:', result);
      if (result) {
        navigate(`/recipes/${id}`);
      } else {
        setAlert('Failed to update recipe');
      }
    } else {
      result = await createRecipe(recipeData);
      if (result) {
        navigate(`/recipes/${result._id}`);
      } else {
        setAlert('Failed to create recipe');
      }
    }
  };
  
  return (
    <div className="form-container" style={{ maxWidth: '700px' }}>
      <h2 className="form-title">{isEditMode ? 'Edit Recipe' : 'Create New Recipe'}</h2>
      
      {alert && (
        <div className="alert alert-danger">
          {alert}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Recipe Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            className="form-input"
            placeholder="Enter recipe title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={onChange}
            className="form-input"
            required
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Dessert">Dessert</option>
            <option value="Snack">Snack</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Recipe Image {!isEditMode && <span style={{ color: 'red' }}>*</span>}
          </label>
          <div className="image-upload-container">
            {image ? (
              <div className="image-preview">
                <img src={image} alt="Recipe preview" className="recipe-image-preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                <button 
                  type="button" 
                  onClick={removeImage} 
                  className="remove-image-btn"
                  style={{ marginTop: '10px', backgroundColor: '#e74c3c', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none' }}
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="form-input"
                  style={{ padding: '10px' }}
                />
                {uploadingImage && (
                  <div style={{ marginTop: '10px', color: '#666' }}>
                    Uploading image...
                  </div>
                )}
                <p className="upload-hint" style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  {!isEditMode ? 'Upload a delicious photo of your recipe (required, max 5MB)' : 'Upload a delicious photo of your recipe (max 5MB)'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Ingredients</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
              <input
                type="text"
                value={ingredient}
                onChange={e => handleIngredientChange(index, e.target.value)}
                className="form-input"
                placeholder={`Ingredient ${index + 1}`}
                style={{ flex: 1, marginRight: '10px' }}
                required
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                style={{ padding: '0 10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '4px', border: 'none' }}
                disabled={ingredients.length === 1}
              >
                -
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            style={{ padding: '5px 10px', backgroundColor: '#2ecc71', color: 'white', borderRadius: '4px' }}
          >
            Add Ingredient
          </button>
        </div>
        
        <div className="form-group">
          <label className="form-label">Steps</label>
          {steps.map((step, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
              <textarea
                value={step}
                onChange={e => handleStepChange(index, e.target.value)}
                className="form-input"
                placeholder={`Step ${index + 1}`}
                style={{ flex: 1, marginRight: '10px', minHeight: '80px' }}
                required
              />
              <button
                type="button"
                onClick={() => removeStep(index)}
                style={{ padding: '0 10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '4px', alignSelf: 'flex-start', border: 'none' }}
                disabled={steps.length === 1}
              >
                -
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            style={{ padding: '5px 10px', backgroundColor: '#2ecc71', color: 'white', borderRadius: '4px' }}
          >
            Add Step
          </button>
        </div>
        
        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '20px' }}>
          {isEditMode ? 'Update Recipe' : 'Create Recipe'}
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;