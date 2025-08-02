'use client';

import React, { useState, useEffect } from 'react';
import { InteractiveStarRating } from './StarRating';
import { ReviewService, ReviewData } from '@/services/firebase/reviewService';
import { OrderService } from '@/services/firebase/orderService';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage?: string;
  userId: string;
  userName: string;
  userEmail: string;
  onReviewSubmitted: () => void;
}

interface FormData {
  rating: number;
  comment: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  userId,
  userName,
  userEmail,
  onReviewSubmitted
}) => {
  const [formData, setFormData] = useState<FormData>({
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [hasUserOrdered, setHasUserOrdered] = useState<boolean>(false);
  const [isCheckingOrder, setIsCheckingOrder] = useState(true);

  // Vérifier si l'utilisateur peut laisser un avis
  useEffect(() => {
    const checkUserCanReview = async () => {
      if (!isOpen || !userId) return;

      setIsCheckingOrder(true);
      setError('');

      try {
        const reviewableProducts = await ReviewService.getProductsUserCanReview(userId);
        setHasUserOrdered(reviewableProducts.includes(productId));
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        setError('Impossible de vérifier vos commandes');
        setHasUserOrdered(false);
      } finally {
        setIsCheckingOrder(false);
      }
    };

    checkUserCanReview();
  }, [isOpen, userId, productId]);

  useEffect(() => {
    if (isOpen) {
      setFormData({ rating: 0, comment: '' });
      setError('');
    }
  }, [isOpen]);

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    setError('');
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, comment: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasUserOrdered) {
      setError('Vous devez avoir commandé ce produit pour laisser un avis');
      return;
    }

    if (formData.rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    if (formData.comment.trim().length < 10) {
      setError('Votre commentaire doit contenir au moins 10 caractères');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const userOrders = await OrderService.getOrdersReadyForReview(userId);
      const orderWithProduct = userOrders.find(order =>
        order.items.some(item => item.productId === productId)
      );

      if (!orderWithProduct) {
        throw new Error('Aucune commande valide trouvée pour ce produit');
      }

      const reviewData: ReviewData = {
        productId,
        userId,
        userName,
        userEmail,
        rating: formData.rating,
        comment: formData.comment.trim(),
        orderId: orderWithProduct.id
      };

      await ReviewService.addReview(reviewData);

      setFormData({ rating: 0, comment: '' });
      onReviewSubmitted();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'envoi de votre avis');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Donner votre avis
              </h3>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {productImage && (
                <img
                  src={productImage}
                  alt={productName}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{productName}</h4>
                <p className="text-sm text-gray-500">Votre avis compte !</p>
              </div>
            </div>
          </div>

          {isCheckingOrder ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Vérification de vos commandes...</p>
            </div>
          ) : !hasUserOrdered ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Avis non autorisé</h4>
              <p className="text-gray-500 mb-6">
                Vous devez avoir commandé et reçu ce produit pour pouvoir laisser un avis.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Votre note *
                </label>
                <div className="flex justify-center">
                  <InteractiveStarRating
                    rating={formData.rating}
                    onRatingChange={handleRatingChange}
                    size="xl"
                  />
                </div>
                {formData.rating > 0 && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {formData.rating === 1 && "😞 Très déçu"}
                    {formData.rating === 2 && "😕 Pas satisfait"}
                    {formData.rating === 3 && "😐 Correct"}
                    {formData.rating === 4 && "😊 Bien"}
                    {formData.rating === 5 && "🤩 Excellent"}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Votre commentaire *
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={formData.comment}
                  onChange={handleCommentChange}
                  placeholder="Partagez votre expérience avec ce produit... (minimum 10 caractères)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.comment.length}/500 caractères</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || formData.rating === 0 || formData.comment.trim().length < 10}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi...
                    </>
                  ) : (
                    'Publier mon avis'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
