'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-amber-50 border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-amber-600" style={{ fontFamily: 'Pacifico, serif' }}>
                Makoti Cookies
              </span>
            </Link>
            <p className="text-gray-600 text-sm">
              Hausgemachte Cookies mit Liebe gebacken für jeden besonderen Moment.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-600 hover:text-amber-600 cursor-pointer">Home</Link></li>
              <li><Link href="/uber-uns" className="text-gray-600 hover:text-amber-600 cursor-pointer">Über uns</Link></li>
              <li><Link href="/service" className="text-gray-600 hover:text-amber-600 cursor-pointer">Service</Link></li>
              <li><Link href="/produkt" className="text-gray-600 hover:text-amber-600 cursor-pointer">Produkt</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Unterstützung</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="text-gray-600 hover:text-amber-600 cursor-pointer">Blog</Link></li>
              <li><Link href="/kontakt" className="text-gray-600 hover:text-amber-600 cursor-pointer">Kontakt</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-amber-600 cursor-pointer">FAQ</a></li>
              <li><a href="#" className="text-gray-600 hover:text-amber-600 cursor-pointer">Versand</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Folgen Sie uns</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors cursor-pointer">
                <i className="ri-facebook-fill"></i>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors cursor-pointer">
                <i className="ri-instagram-line"></i>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors cursor-pointer">
                <i className="ri-twitter-line"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-amber-200 mt-8 pt-8">
          <p className="text-center text-gray-600 text-sm">
            © 2024 Makoti Cookies. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}