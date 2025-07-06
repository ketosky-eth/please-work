import React, { useState, useEffect } from 'react';
import SidePanel from './components/SidePanel';
import HomePage from './components/HomePage';
import MintPage from './components/MintPage';
import LaunchMemePage from './components/LaunchMemePage';
import MyVaultPage from './components/MyVaultPage';
import RoadmapPage from './components/RoadmapPage';
import RenouncePage from './components/RenouncePage';
import ClaimPage from './components/ClaimPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Handle URL routing
  useEffect(() => {
    const path = window.location.pathname;
    const page = path.substring(1) || 'home';
    
    // Valid pages (removed 'tokens' and added new LP vault pages)
    const validPages = ['home', 'launch', 'vault', 'roadmap', 'mint', 'renounce', 'claim'];
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
      case 'vault':
        return <MyVaultPage />;
      case 'roadmap':
        return <RoadmapPage />;
      case 'mint':
        return <MintPage />; // Hidden but still accessible via direct URL
      case 'renounce':
        return <RenouncePage />;
      case 'claim':
        return <ClaimPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <SidePanel currentPage={currentPage} onPageChange={handlePageChange} />
      <div className="flex-1 ml-64">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;