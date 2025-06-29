import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import MintPage from './components/MintPage';
import LaunchMemePage from './components/LaunchMemePage';
import MyVaultPage from './components/MyVaultPage';
import DocsPage from './components/DocsPage';
import RoadmapPage from './components/RoadmapPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

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
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;