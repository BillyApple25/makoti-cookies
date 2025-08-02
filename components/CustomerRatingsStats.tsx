'use client';

import React, { useEffect, useState } from 'react';
import { ReviewService } from '@/services/firebase/reviewService';
import StarRating from './StarRating';

interface CustomerRatingsStatsProps {
  className?: string;
}

export default function CustomerRatingsStats({ className = "" }: CustomerRatingsStatsProps) {
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    fiveStarCount: 0,
    satisfactionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const allReviews = await ReviewService.getAllReviews();
        
        if (allReviews.length > 0) {
          const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRating / allReviews.length;
          const fiveStarReviews = allReviews.filter(review => review.rating === 5).length;
          const fourAndFiveStars = allReviews.filter(review => review.rating >= 4).length;
          const satisfactionRate = (fourAndFiveStars / allReviews.length) * 100;

          setStats({
            totalReviews: allReviews.length,
            averageRating: avgRating,
            fiveStarCount: fiveStarReviews,
            satisfactionRate
          });
        }
      } catch (error) {
        console.error('Error loading customer stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading || stats.totalReviews === 0) {
    return null; // Don't show anything if no reviews yet
  }

  return (
    <div className={`bg-gradient-to-r from-amber-50 to-orange-50 py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Was unsere <span className="text-amber-600 font-pacifico">Kunden sagen</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Die Zufriedenheit unserer Kunden ist unser größter Erfolg
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Average Rating */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-amber-600 mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <StarRating 
              rating={stats.averageRating}
              reviewCount={0}
              showReviewCount={false}
              size="lg"
            />
            <p className="text-gray-600 mt-2 font-medium">
              Durchschnittsbewertung
            </p>
          </div>

          {/* Total Reviews */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-blue-600 mb-4">
              {stats.totalReviews}+
            </div>
            <p className="text-gray-600 font-medium">
              Zufriedene Kunden
            </p>
            <p className="text-sm text-gray-500 mt-1">
              haben uns bewertet
            </p>
          </div>

          {/* Five Star Reviews */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-green-600 mb-4">
              {stats.fiveStarCount}
            </div>
            <p className="text-gray-600 font-medium">
              5-Sterne Bewertungen
            </p>
            <p className="text-sm text-gray-500 mt-1">
              absolute Bestnoten
            </p>
          </div>

          {/* Satisfaction Rate */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-purple-600 mb-4">
              {Math.round(stats.satisfactionRate)}%
            </div>
            <p className="text-gray-600 font-medium">
              Zufriedenheitsrate
            </p>
            <p className="text-sm text-gray-500 mt-1">
              4+ Sterne Bewertungen
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 mb-4">
            Werden Sie Teil unserer zufriedenen Kundenfamilie!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-600 text-white px-8 py-3 rounded-full hover:bg-amber-700 transition-colors font-semibold">
              Jetzt bestellen
            </button>
            <button className="border-2 border-amber-600 text-amber-600 px-8 py-3 rounded-full hover:bg-amber-600 hover:text-white transition-colors font-semibold">
              Alle Bewertungen lesen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 