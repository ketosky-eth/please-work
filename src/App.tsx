import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import MintPage from './components/MintPage';
import LaunchMemePage from './components/LaunchMemePage';
import MyVaultPage from './components/MyVaultPage';
import DocsPage from './components/DocsPage';
import RoadmapPage from './components/RoadmapPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Handle URL routing
  useEffect(() => {
    const path = window.location.pathname;
    const page = path.substring(1) || 'home';
    
    // Valid pages
    const validPages = ['home', 'mint', 'launch', 'vault', 'docs', 'roadmap'];
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
      case 'mint':
        return <MintPage />;
      case 'launch':
        return <LaunchMemePage />;
      case 'vault':
        return <MyVaultPage />;
      case 'docs':
        return <DocsPage />;
      case 'roadmap':
        return <RoadmapPage />;
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