import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AllTokensPage from './components/AllTokensPage';
import MintPage from './components/MintPage';
import LaunchMemePage from './components/LaunchMemePage';
import MyVaultPage from './components/MyVaultPage';
import RoadmapPage from './components/RoadmapPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Handle URL routing
  useEffect(() => {
    const path = window.location.pathname;
    const page = path.substring(1) || 'home';
    
    // Valid pages (removed 'mint' from visible navigation)
    const validPages = ['home', 'launch', 'tokens', 'vault', 'roadmap', 'mint'];
    if (validPages.includes(page)) {
      setCurrentPage(page);
    } else {
      setCurrentPage('home');
      window.history.replaceState(null, '', '/');
    }

    // Listen for browser back/forward
    const handlePopState = () => {
      const newPath = window.location.pathname;
      const newPage = newPath.substring(1) || 'home';
      if (validPages.includes(newPage)) {
        setCurrentPage(newPage);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    const url = page === 'home' ? '/' : `/${page}`;
    window.history.pushState(null, '', url);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'launch':
        return <LaunchMemePage />;
      case 'tokens':
        return <AllTokensPage />;
      case 'vault':
        return <MyVaultPage />;
      case 'roadmap':
        return <RoadmapPage />;
      case 'mint':
        return <MintPage />; // Hidden but still accessible via direct URL
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      {renderPage()}
    </div>
  );
}

export default App;