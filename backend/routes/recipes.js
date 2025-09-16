const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { uploadImage, deleteImage } = require('../config/cloudinary');


router.post('/', auth, async (req, res) => {
  const { title, ingredients, steps, category, image, imagePublicId } = req.body;

  try {
    const newRecipe = new Recipe({
      user: req.user.id,
      title,
      ingredients,
      steps,
      category,
      image: image || '',
      imagePublicId: imagePublicId || ''
    });

    const recipe = await newRecipe.save();
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});




router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ date: -1 });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.get('/user', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id }).sort({ date: -1 });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.get('/favorites', auth, async (req, res) => {
  try {
   
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.get('/category/:category', async (req, res) => {
  try {
    const recipes = await Recipe.find({ category: req.params.category }).sort({ date: -1 });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('user', ['name']);
    
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    res.status(500).send('Server error');
  }
});


router.put('/:id', auth, async (req, res) => {
  const { title, ingredients, steps, category, image } = req.body;

  try {
    let recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    
    
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
  
    recipe.title = title !== undefined ? title : recipe.title;
    recipe.ingredients = ingredients !== undefined ? ingredients : recipe.ingredients;
    recipe.steps = steps !== undefined ? steps : recipe.steps;
    recipe.category = category !== undefined ? category : recipe.category;
    recipe.image = image !== undefined ? image : recipe.image;
    
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    res.status(500).send('Server error');
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    

    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Recipe removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    res.status(500).send('Server error');
  }
});


router.put('/like/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    
 
    const isLiked = recipe.likes.some(like => like.toString() === req.user.id);
    
    if (isLiked) {
    
      recipe.likes = recipe.likes.filter(like => like.toString() !== req.user.id);
    } else {

      recipe.likes.push(req.user.id);
    }
    
    await recipe.save();
    res.json(recipe.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    res.status(500).send('Server error');
  }
});

// Image upload endpoint
router.post('/upload-image', auth, async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({ msg: 'No image provided' });
    }

    // Remove data:image/jpeg;base64, prefix if it exists
    const base64Data = req.body.image.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const result = await uploadImage(buffer);
    
    if (result.success) {
      res.json({ 
        success: true, 
        imageUrl: result.url,
        publicId: result.public_id 
      });
    } else {
      res.status(500).json({ msg: result.error });
    }
  } catch (err) {
    console.error('Image upload error:', err.message);
    res.status(500).send('Server error');
  }
});

// Image delete endpoint
router.delete('/delete-image/:publicId', auth, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await deleteImage(publicId);
    
    if (result.success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ msg: result.error });
    }
  } catch (err) {
    console.error('Image delete error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;