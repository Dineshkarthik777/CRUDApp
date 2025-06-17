import React, { useState } from 'react';
import { BookProvider } from './contexts/BookContext';
import { Header } from './components/Layout/Header';
import { AddBookForm } from './components/Books/AddBookForm';
import { Dashboard } from './components/Dashboard/Dashboard';

type Page = 'add-book' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'add-book':
        return <AddBookForm onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <BookProvider>
      <div className="min-h-screen bg-gray-50">
        <Header 
          onNavigate={handleNavigate} 
          currentPage={currentPage}
        />
        {renderPage()}
      </div>
    </BookProvider>
  );
}

export default App;