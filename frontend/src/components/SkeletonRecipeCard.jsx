import React from 'react';

const SkeletonRecipeCard = () => {
  return (
    <div className="skeleton-recipe-card">
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-category"></div>
        <div className="skeleton-meta"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
};

export default SkeletonRecipeCard;