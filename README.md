# 🍳 RecipeShare - Full-Stack Recipe Sharing Platform

A modern, responsive recipe sharing application built with React.js frontend and Node.js/Express backend. Users can discover, create, share, and manage their favorite recipes with features like user authentication, recipe categorization, image uploads, and social interactions.



## Screenshots
<img width="600" height="837" alt="image" src="https://github.com/user-attachments/assets/cd307238-14cd-4bea-9d7c-0ed29e6c5587" />
<img width="600" height="847" alt="image" src="https://github.com/user-attachments/assets/64036775-5e76-4979-9634-bc7a71d2eaec" />
<img width="600" height="833" alt="image" src="https://github.com/user-attachments/assets/c1241173-a385-4230-a7ba-10d991bec834" />
<img width="600" height="844" alt="image" src="https://github.com/user-attachments/assets/6f8a6734-aee7-4923-b6a5-8ac129d1947b" />
<img width="600" height="831" alt="image" src="https://github.com/user-attachments/assets/67a50b9d-06c8-4dd3-80d1-0ba980e3ad86" />



## 🌟 Features
### Core Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Recipe Management**: Create, edit, and delete personal recipes
- **Image Upload**: Cloud-based image storage with Cloudinary
- **Recipe Discovery**: Browse all recipes with category filtering
- **Search Functionality**: Real-time recipe search across titles and ingredients
- **Responsive Design**: Mobile-first design that works on all devices

### User Features
- **User Profiles**: Personalized dashboard showing user's recipes
- **Favorites System**: Save favorite recipes for quick access
- **Like System**: Like recipes and see like counts
- **Recipe Details**: Detailed view with ingredients, instructions, and images
- **Latest Recipes**: Always see the newest recipes added

### Technical Features
- **RESTful API**: Clean backend architecture with Express.js
- **MongoDB Database**: Scalable NoSQL database with Mongoose ODM
- **Cloud Storage**: Cloudinary integration for image management
- **Protected Routes**: Authentication-based route protection
- **Loading States**: Skeleton loaders for better UX
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite build tool
- **React Router v7** for client-side routing
- **Axios** for HTTP requests
- **JWT Decode** for token management
- **Cloudinary React SDK** for image handling

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cloudinary SDK** for image uploads
- **BcryptJS** for password hashing

### Development Tools
- **ESLint** for code linting
- **Nodemon** for development server
- **Vite** for fast development and building

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary** account for image storage

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/narsijangid/RecipeShare.git
cd Recipe
```

### 2. Backend Setup

#### Environment Variables
Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Install Dependencies
```bash
cd backend
npm install
```

#### Start Backend Server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start Development Server
```bash
npm run dev
```

The frontend development server will run on `http://localhost:5173`

## 🔧 Detailed Setup Instructions

### MongoDB Setup

#### Option 1: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Add your IP to the whitelist
5. Get your connection string

#### Option 2: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/recipebook`

### Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com)
2. Go to Dashboard to get your credentials
3. Note down: Cloud Name, API Key, and API Secret

### Environment Configuration

#### Backend Environment Variables (.env)
```env
# Server Configuration
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/recipebook?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📁 Project Structure

```
Recipe/
├── backend/                 # Backend Node.js application
│   ├── config/             # Configuration files
│   │   ├── cloudinary.js   # Cloudinary setup
│   │   └── upload.js       # Multer upload config
│   ├── middleware/         # Custom middleware
│   │   └── auth.js         # JWT authentication middleware
│   ├── models/             # MongoDB models
│   │   ├── Recipe.js       # Recipe schema
│   │   └── User.js         # User schema
│   ├── routes/             # API routes
│   │   ├── recipes.js      # Recipe CRUD operations
│   │   └── users.js        # User authentication routes
│   ├── .env                # Environment variables
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/       # React Context providers
│   │   │   ├── AuthContext.js    # Authentication context
│   │   │   └── RecipeContext.js  # Recipe management context
│   │   ├── pages/         # Page components
│   │   │   ├── Home.js           # Home page with recipe listing
│   │   │   ├── Login.js          # User login page
│   │   │   ├── Register.js       # User registration page
│   │   │   ├── CreateRecipe.js   # Recipe creation/editing
│   │   │   ├── RecipeDetail.js   # Individual recipe view
│   │   │   ├── Profile.js        # User profile page
│   │   │   └── NotFound.js       # 404 page
│   │   ├── utils/         # Utility functions
│   │   ├── config/        # Configuration files
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # React entry point
│   ├── index.html         # HTML template
│   └── package.json       # Frontend dependencies
│
└── README.md              # This file
```

## 🎯 Available Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

### Frontend Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 API Endpoints

### Authentication Routes (`/api/users`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update user profile (protected)

### Recipe Routes (`/api/recipes`)
- `GET /` - Get all recipes (with pagination)
- `GET /:id` - Get single recipe by ID
- `POST /` - Create new recipe (protected)
- `PUT /:id` - Update recipe (protected, owner only)
- `DELETE /:id` - Delete recipe (protected, owner only)
- `GET /user/:userId` - Get recipes by specific user
- `POST /:id/like` - Like/unlike recipe (protected)

## 🖼️ Frontend Pages

### Public Pages
- **Home (`/`)** - Recipe discovery with search and filtering
- **Recipe Detail (`/recipes/:id`)** - Detailed recipe view
- **Login (`/login`)** - User authentication
- **Register (`/register`)** - New user registration

### Protected Pages (Requires Login)
- **Create Recipe (`/create-recipe`)** - Add new recipe
- **Edit Recipe (`/edit-recipe/:id`)** - Modify existing recipe
- **Profile (`/profile`)** - User dashboard with personal recipes

## 🎨 Design Features

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 992px, 1200px
- Touch-friendly interface for mobile devices

### UI/UX Features
- **Skeleton Loaders**: Smooth loading experience
- **Gradient Design**: Modern gradient backgrounds and buttons
- **Hover Effects**: Interactive elements with smooth transitions
- **Loading States**: Clear feedback during async operations
- **Error Handling**: User-friendly error messages

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Recipe creation with image upload
- [ ] Recipe editing and deletion
- [ ] Search functionality
- [ ] Category filtering
- [ ] Like and favorite features
- [ ] Responsive design on mobile devices
- [ ] Protected route access

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables on platform
2. Connect GitHub repository
3. Deploy automatically on push to main branch

### Frontend Deployment (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables for API URL

### Environment Variables for Production
```env
# Frontend .env
VITE_API_URL=https://your-backend-url.com/api

# Backend production
NODE_ENV=production
PORT=process.env.PORT
```

## 🔍 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: MongoDB Connection Error
```
**Solution**: Check your MONGO_URI in .env file and ensure MongoDB is accessible

#### Cloudinary Upload Error
```
Error: Cloudinary upload failed
```
**Solution**: Verify Cloudinary credentials and ensure file size limits

#### CORS Issues
```
Error: CORS policy error
```
**Solution**: Backend CORS is configured for localhost:5173, adjust if needed

#### Port Already in Use
```
Error: Port 5000 already in use
```
**Solution**: Change PORT in .env file or kill existing process

## 📞 Support

For support or questions:
- Create an issue in the GitHub repository
- Check existing issues for solutions
- Review this README for setup guidance

**Happy Cooking! 🍳** Share your favorite recipes with the world!
