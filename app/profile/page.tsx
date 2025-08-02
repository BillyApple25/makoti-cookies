'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '@/components/AuthProvider';
import { StorageService } from '@/services/firebase/storageService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProfilePage() {
  const { user, userProfile, updateProfile, isAuthenticated } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    vorname: '',
    nachname: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when userProfile is loaded
  useEffect(() => {
    if (userProfile) {
      setFormData({
        vorname: userProfile.vorname || '',
        nachname: userProfile.nachname || ''
      });
    }
  }, [userProfile]);

  // Redirect si pas connecté
  if (!isAuthenticated || !user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-amber-50 py-12">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Zugriff verweigert</h1>
            <p className="text-gray-600 mb-6">Bitte melden Sie sich an, um Ihr Profil zu verwalten.</p>
            <a 
              href="/login" 
              className="bg-amber-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors"
            >
              Anmelden
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.vorname.trim() || !formData.nachname.trim()) {
      setError('Vor- und Nachname sind erforderlich.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        vorname: formData.vorname.trim(),
        nachname: formData.nachname.trim()
      });
      
      setSuccess('Profil erfolgreich aktualisiert!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Profils:', error);
      setError('Fehler beim Speichern der Änderungen. Bitte versuchen Sie es erneut.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validierung
    if (!file.type.startsWith('image/')) {
      setError('Bitte wählen Sie eine gültige Bilddatei aus.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('Die Datei ist zu groß. Maximale Dateigröße: 5MB.');
      return;
    }

    setError('');
    setIsUploadingImage(true);

    try {
      const { url } = await StorageService.uploadUserProfileImage(file, user.uid);
      
      await updateProfile({ image: url });
      setSuccess('Profilbild erfolgreich aktualisiert!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes:', error);
      setError('Fehler beim Hochladen des Bildes. Bitte versuchen Sie es erneut.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const currentImage = userProfile?.image || user.photoURL || '/default-avatar.svg';

  return (
    <>
      <Header />
      <div className="min-h-screen bg-amber-50 py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-6">
              <h1 className="text-3xl font-bold text-white">Mein Profil</h1>
              <p className="text-amber-100 mt-2">Verwalten Sie Ihre persönlichen Informationen</p>
            </div>

            <div className="p-8">
              {/* Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg">
                  <p className="text-green-700">{success}</p>
                </div>
              )}

              {/* Avatar Section */}
              <div className="flex items-center space-x-6 mb-8 pb-8 border-b">
                <div className="relative">
                  <img
                    src={currentImage}
                    alt="Profilbild"
                    className="w-24 h-24 rounded-full object-cover border-4 border-amber-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-avatar.svg';
                    }}
                  />
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Profilbild</h3>
                  <p className="text-gray-600 text-sm mb-3">JPG, PNG oder GIF. Maximal 5MB.</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-medium hover:bg-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploadingImage ? 'Wird hochgeladen...' : 'Bild ändern'}
                  </button>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSaveProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-Mail-Adresse
                    </label>
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">E-Mail kann nicht geändert werden</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mitglied seit
                    </label>
                    <input
                      type="text"
                      value={userProfile?.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString('de-DE') : 'Unbekannt'}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vorname *
                    </label>
                    <input
                      type="text"
                      name="vorname"
                      value={formData.vorname}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:text-gray-500"
                      placeholder="Ihr Vorname"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nachname *
                    </label>
                    <input
                      type="text"
                      name="nachname"
                      value={formData.nachname}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:text-gray-500"
                      placeholder="Ihr Nachname"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                    >
                      <i className="ri-edit-line mr-2"></i>
                      Profil bearbeiten
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span className="ml-2">Speichern...</span>
                          </>
                        ) : (
                          <>
                            <i className="ri-save-line mr-2"></i>
                            Änderungen speichern
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            vorname: userProfile?.vorname || '',
                            nachname: userProfile?.nachname || ''
                          });
                          setError('');
                        }}
                        disabled={isSaving}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="ri-close-line mr-2"></i>
                        Abbrechen
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 