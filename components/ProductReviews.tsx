'use client';

import React, { useEffect, useState } from 'react';
import { ReviewService } from '@/services/firebase/reviewService';
import { Review } from '@/types/firebase';
import { QuickStarRating } from './StarRating';
import LoadingSpinner from './LoadingSpinner';
import { useAuthContext } from './AuthProvider';

interface ProductReviewsProps {
  productId: string;
  productName: string;
  onReviewClick?: () => void; // Callback pour ouvrir la modal de review
  userCanReview?: boolean;
  refreshTrigger?: number; // Pour forcer le rechargement
}

export default function ProductReviews({ 
  productId, 
  productName, 
  onReviewClick,
  userCanReview = false,
  refreshTrigger = 0
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        console.log('\n🔄 ProductReviews - DÉBUT CHARGEMENT');
        console.log('📦 ProductReviews - productId:', productId);
        console.log('🔁 ProductReviews - refreshTrigger:', refreshTrigger);
        console.log('🏷️ ProductReviews - productName:', productName);
        
        const productReviews = await ReviewService.getReviewsByProductId(productId);
        console.log('📊 ProductReviews - Reviews chargées:', productReviews.length, 'reviews');
        
        if (productReviews.length > 0) {
          console.log('✅ ProductReviews - REVIEWS TROUVÉES !');
          productReviews.forEach((review, index) => {
            console.log(`  Review ${index + 1}: ${review.rating}⭐ par ${review.userName} - "${review.comment}"`);
          });
        } else {
          console.log('❌ ProductReviews - AUCUNE REVIEW TROUVÉE !');
          console.log('🔍 ProductReviews - Vérification directe avec query...');
          
          // Double vérification directe
          try {
            const directRating = await ReviewService.getProductRating(productId);
            console.log('🔍 ProductReviews - Rating direct:', directRating);
          } catch (error) {
            console.log('❌ ProductReviews - Erreur rating direct:', error);
          }
        }
        
        setReviews(productReviews);
        console.log('🔄 ProductReviews - FIN CHARGEMENT\n');
      } catch (error) {
        console.error('❌ ProductReviews - Erreur loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [productId, refreshTrigger]);

  if (loading) {
    return (
      <div className="py-8">
        <LoadingSpinner size="sm" message="Chargement des avis..." />
      </div>
    );
  }

  // 🔧 CORRECTION : Vérifier une deuxième fois s'il y a vraiment des reviews
  const shouldShowNoReviews = reviews.length === 0;
  
  console.log('🔍 ProductReviews - shouldShowNoReviews:', shouldShowNoReviews);
  console.log('🔍 ProductReviews - reviews.length:', reviews.length);
  console.log('🔍 ProductReviews - refreshTrigger:', refreshTrigger);

  if (shouldShowNoReviews) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Kundenbewertungen</h3>
          {isAuthenticated && userCanReview && onReviewClick && (
            <button
              onClick={onReviewClick}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Bewertung hinterlassen
            </button>
          )}
        </div>
        
        <p className="text-gray-600 mb-2">Noch keine Bewertungen für {productName}.</p>
        <p className="text-sm text-gray-500 mb-4">
          Seien Sie der Erste, der dieses Produkt bewertet!
        </p>

        {!isAuthenticated && (
          <p className="text-sm text-amber-600">
            Melden Sie sich an, um eine Bewertung zu hinterlassen.
          </p>
        )}

        {isAuthenticated && !userCanReview && (
          <p className="text-sm text-gray-500">
            Sie können nur Produkte bewerten, die Sie gekauft und erhalten haben.
          </p>
        )}
      </div>
    );
  }

  // Calculate rating statistics
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Kundenbewertungen</h3>
        {isAuthenticated && userCanReview && onReviewClick && (
          <button
            onClick={onReviewClick}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Bewertung hinterlassen
          </button>
        )}
      </div>
      
      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-amber-600 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <QuickStarRating 
              rating={averageRating} 
              reviewCount={reviews.length}
              size="lg"
            />
            <p className="text-gray-600 mt-2">
              Basiert auf {reviews.length} Bewertung{reviews.length !== 1 ? 'en' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Bewertungsverteilung</h4>
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center mb-2">
                <div className="flex items-center w-16">
                  <span className="text-sm font-medium text-gray-700 mr-1">{stars}</span>
                  <span className="text-yellow-400">★</span>
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${reviews.length > 0 ? (ratingDistribution[stars as keyof typeof ratingDistribution] / reviews.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">
                  {ratingDistribution[stars as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Alle Bewertungen ({reviews.length})
        </h4>
        
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 font-semibold text-lg">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{review.userName}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <QuickStarRating 
                        rating={review.rating} 
                        reviewCount={0} 
                        size="sm" 
                      />
                      <span className="text-sm text-gray-500">
                        • {review.createdAt && review.createdAt.toDate 
                          ? review.createdAt.toDate().toLocaleDateString('de-DE', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Récemment'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Rating Badge */}
                <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {review.rating}/5
                </div>
              </div>
              
              <div className="ml-15">
                <p className="text-gray-700 leading-relaxed text-base">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>

        {reviews.length > 3 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {showAll ? 'Weniger anzeigen' : `Alle ${reviews.length} Bewertungen anzeigen`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 