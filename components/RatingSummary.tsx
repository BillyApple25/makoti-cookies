'use client';

import React, { useEffect, useState } from 'react';
import { ReviewService } from '@/services/firebase/reviewService';
import { useProducts } from '@/hooks/useProducts';
import StarRating from './StarRating';
import LoadingSpinner from './LoadingSpinner';

interface RatingSummaryProps {
  title?: string;
  limit?: number;
  showProductNames?: boolean;
}

export default function RatingSummary({ 
  title = "Am besten bewertete Produkte", 
  limit = 5,
  showProductNames = true 
}: RatingSummaryProps) {
  const [topRatedProducts, setTopRatedProducts] = useState<Array<{
    productId: string;
    rating: number;
    reviewCount: number;
    productName?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const { products } = useProducts();

  useEffect(() => {
    const loadTopRatedProducts = async () => {
      try {
        setLoading(true);
        const topRated = await ReviewService.getTopRatedProducts(limit);
        
        // Add product names if requested
        if (showProductNames && products.length > 0) {
          const enrichedData = topRated.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
              ...item,
              productName: product?.name || 'Produkt nicht gefunden'
            };
          }).filter(item => item.productName !== 'Produkt nicht gefunden');
          
          setTopRatedProducts(enrichedData);
        } else {
          setTopRatedProducts(topRated);
        }
      } catch (error) {
        console.error('Error loading top rated products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTopRatedProducts();
  }, [limit, showProductNames, products]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <LoadingSpinner size="sm" message="Laden der besten Bewertungen..." />
      </div>
    );
  }

  if (topRatedProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600">Noch keine bewerteten Produkte verfügbar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
      
      <div className="space-y-4">
        {topRatedProducts.map((item, index) => (
          <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              
              <div className="flex-1">
                {showProductNames && item.productName && (
                  <p className="font-medium text-gray-800 mb-1">{item.productName}</p>
                )}
                <div className="flex items-center space-x-2">
                  <StarRating 
                    rating={item.rating}
                    reviewCount={item.reviewCount}
                    size="sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-amber-600">
                {item.rating.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">
                {item.reviewCount} Bewertung{item.reviewCount !== 1 ? 'en' : ''}
              </div>
            </div>
          </div>
        ))}
      </div>

      {topRatedProducts.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">Keine Daten verfügbar</p>
        </div>
      )}
    </div>
  );
} 