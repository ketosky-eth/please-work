import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';
import MintPage from './components/MintPage';
import LaunchMemePage from './components/LaunchMemePage';
import MyVaultPage from './components/MyVaultPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'landing':
        return <LandingPage />;
      case 'mint':
        return <MintPage />;
      case 'launch':
        return <LaunchMemePage />;
      case 'vault':
        return <MyVaultPage />;
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