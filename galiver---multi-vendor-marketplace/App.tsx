
import React, { useState, useEffect } from 'react';
import CustomerView from './views/CustomerView';
import VendorView from './views/VendorView';
import AdminView from './views/AdminView';

type ViewMode = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('CUSTOMER');

  // Simple route simulation using hash for easier switching during dev
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toUpperCase();
      if (hash === 'VENDOR' || hash === 'ADMIN' || hash === 'CUSTOMER') {
        setView(hash as ViewMode);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen relative font-sans">
      {/* Dev Navigation Toggle */}
      <div className="fixed top-4 right-4 z-[9999] hidden md:flex gap-2 bg-black/80 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl">
        <button 
          onClick={() => window.location.hash = 'customer'}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === 'CUSTOMER' ? 'bg-[#f85606] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          Customer
        </button>
        <button 
          onClick={() => window.location.hash = 'vendor'}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === 'VENDOR' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          Vendor
        </button>
      </div>

      <main className="transition-opacity duration-300">
        {view === 'CUSTOMER' && <CustomerView />}
        {view === 'VENDOR' && <VendorView />}
        {view === 'ADMIN' && <AdminView />}
      </main>
    </div>
  );
};

export default App;
