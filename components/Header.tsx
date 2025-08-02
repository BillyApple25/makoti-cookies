'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import { useAuthContext } from './AuthProvider';
import CartDrawer from './CartDrawer';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, userProfile, isAuthenticated, signOut, loading } = useAuthContext();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/uber-uns', label: 'Über uns' },
    { href: '/service', label: 'Service' },
    { href: '/produkt', label: 'Produkt' },
    { href: '/blog', label: 'Blog' },
    { href: '/kontakt', label: 'Kontakt' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const getLinkClasses = (href: string) => {
    const baseClasses = "transition-colors font-medium";
    const activeClasses = "text-amber-600 font-semibold";
    const inactiveClasses = "text-gray-700 hover:text-amber-600";
    
    return `${baseClasses} ${isActive(href) ? activeClasses : inactiveClasses}`;
  };

  const getMobileLinkClasses = (href: string) => {
    const baseClasses = "py-2 cursor-pointer transition-colors";
    const activeClasses = "text-amber-600 font-semibold";
    const inactiveClasses = "text-gray-700 hover:text-amber-600";
    
    return `${baseClasses} ${isActive(href) ? activeClasses : inactiveClasses}`;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-amber-600 font-pacifico">
                Makoti Cookies
              </span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={getLinkClasses(item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
              >
                <i className="ri-shopping-cart-line text-xl"></i>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Authentification */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={user.photoURL || userProfile?.image || '/default-avatar.svg'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-avatar.svg';
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {userProfile?.vorname || user.displayName?.split(' ')[0] || 'User'}
                    </span>
                    <i className={`ri-arrow-down-s-line transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {userProfile?.vorname && userProfile?.nachname 
                            ? `${userProfile.vorname} ${userProfile.nachname}`
                            : user.displayName
                          }
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="ri-user-line mr-2"></i>Mein Profil
                      </Link>
                      <Link
                        href="/commandes"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="ri-shopping-bag-line mr-2"></i>Meine Bestellungen
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="ri-logout-box-line mr-2"></i>Abmelden
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transition-colors whitespace-nowrap flex items-center space-x-2"
                >
                  <i className="ri-google-line"></i>
                  <span>Anmelden</span>
                </Link>
              )}
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
              >
                <i className="ri-shopping-cart-line text-xl"></i>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-6 h-6 flex items-center justify-center cursor-pointer"
              >
                <i className="ri-menu-line text-xl"></i>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={getMobileLinkClasses(item.href)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Menu mobile - Authentification */}
                <div className="pt-2 border-t border-gray-200 mt-2">
                  {isAuthenticated && user ? (
                    <div className="space-y-2">
                      <div className="px-2 py-2 flex items-center space-x-3">
                        <img
                          src={user.photoURL || userProfile?.image || '/default-avatar.svg'}
                          alt="Profile"
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-avatar.svg';
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {userProfile?.vorname || user.displayName?.split(' ')[0] || 'User'}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        className="block py-2 text-gray-700 hover:text-amber-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className="ri-user-line mr-2"></i>Mein Profil
                      </Link>
                      <Link
                        href="/commandes"
                        className="block py-2 text-gray-700 hover:text-amber-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className="ri-shopping-bag-line mr-2"></i>Meine Bestellungen
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left py-2 text-gray-700 hover:text-amber-600"
                      >
                        <i className="ri-logout-box-line mr-2"></i>Abmelden
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transition-colors mt-2 whitespace-nowrap cursor-pointer flex items-center justify-center space-x-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="ri-google-line"></i>
                      <span>Anmelden</span>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}