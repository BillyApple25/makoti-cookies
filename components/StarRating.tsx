import React from 'react';

interface StarRatingProps {
  rating: number; // Note moyenne (0-5)
  reviewCount?: number; // Nombre total d'avis
  maxStars?: number; // Nombre maximum d'étoiles (par défaut 5)
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // Taille des étoiles
  showRating?: boolean; // Afficher la note numérique
  showReviewCount?: boolean; // Afficher le nombre d'avis
  interactive?: boolean; // Pour les formulaires (étoiles cliquables)
  onRatingChange?: (rating: number) => void; // Callback pour mode interactif
  className?: string; // Classes CSS supplémentaires
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  reviewCount = 0,
  maxStars = 5,
  size = 'md',
  showRating = false,
  showReviewCount = false,
  interactive = false,
  onRatingChange,
  className = ''
}) => {
  // Gestion de l'état pour le mode interactif
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  
  // Classes CSS selon la taille
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Générer les étoiles
  const generateStars = () => {
    const stars = [];
    const currentRating = interactive && hoverRating > 0 ? hoverRating : rating;
    
    for (let i = 1; i <= maxStars; i++) {
      const isFilled = i <= currentRating;
      const isHalfFilled = !isFilled && i - 0.5 <= currentRating;
      
      stars.push(
        <button
          key={i}
          type="button"
          disabled={!interactive}
          className={`
            relative inline-block transition-all duration-200 
            ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
            ${sizeClasses[size]}
          `}
          onClick={() => interactive && onRatingChange?.(i)}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          aria-label={`${i} étoile${i > 1 ? 's' : ''}`}
        >
          {/* Étoile de base (grise) */}
          <span className="text-gray-300">★</span>
          
          {/* Étoile colorée (jaune) */}
          {(isFilled || isHalfFilled) && (
            <span 
              className={`
                absolute inset-0 text-yellow-500 overflow-hidden
                ${isHalfFilled ? 'w-1/2' : 'w-full'}
              `}
            >
              ★
            </span>
          )}
        </button>
      );
    }
    
    return stars;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Étoiles */}
      <div className="flex items-center gap-0.5">
        {generateStars()}
      </div>

      {/* Note numérique */}
      {showRating && rating > 0 && (
        <span className={`font-semibold text-gray-700 ${textSizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}

      {/* Nombre d'avis */}
      {showReviewCount && (
        <span className={`text-gray-500 ${textSizeClasses[size]}`}>
          ({reviewCount} avis)
        </span>
      )}

      {/* Message si aucun avis */}
      {showReviewCount && reviewCount === 0 && (
        <span className={`text-gray-400 ${textSizeClasses[size]}`}>
          Aucun avis
        </span>
      )}
    </div>
  );
};

// 🎯 Composant simplifié pour affichage rapide
export const QuickStarRating: React.FC<{
  rating: number;
  reviewCount: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}> = ({ rating, reviewCount, size = 'sm' }) => (
  <StarRating
    rating={rating}
    reviewCount={reviewCount}
    size={size}
    showRating={true}
    showReviewCount={true}
  />
);

// 🎯 Composant pour formulaires (interactif)
export const InteractiveStarRating: React.FC<{
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: 'md' | 'lg' | 'xl';
}> = ({ rating, onRatingChange, size = 'lg' }) => (
  <StarRating
    rating={rating}
    interactive={true}
    onRatingChange={onRatingChange}
    size={size}
    showRating={true}
  />
);

export default StarRating; 