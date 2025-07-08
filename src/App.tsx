import React, { useState, useEffect } from 'react';
import SidePanel from './components/SidePanel';
import HomePage from './components/HomePage';
import MintPage from './components/MintPage';
import LaunchMemePage from './components/LaunchMemePage';
import MyVaultPage from './components/MyVaultPage';
import RoadmapPage from './components/RoadmapPage';
import RenouncePage from './components/RenouncePage';
import ClaimPage from './components/ClaimPage';
import FlamenizePage from './components/FlamenizePage';
import AnalyticsPage from './components/AnalyticsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle URL routing
  useEffect(() => {
    const path = window.location.pathname;
    const page = path.substring(1) || 'home';
    
    // Valid pages (removed 'tokens' and added new LP vault pages)
    const validPages = ['home', 'flamenize', 'launch', 'vault', 'roadmap', 'mint', 'renounce', 'claim', 'analytics'];
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
      case 'flamenize':
        return <FlamenizePage />;
      case 'analytics':
        return <AnalyticsPage />;
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

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      setSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle as EventListener);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle as EventListener);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <SidePanel currentPage={currentPage} onPageChange={handlePageChange} />
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;