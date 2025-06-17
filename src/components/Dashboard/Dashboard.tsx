import React, { useState } from 'react';
import { Book, Search, Filter, Star, Edit, Trash2, Plus, BarChart3, Calendar, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { useBooks } from '../../contexts/BookContext';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { books, deleteBook, isLoading, error, refreshBooks } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');

  const filteredBooks = books.filter(book => {
    const matchesSearch = !searchTerm || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    const matchesCondition = !selectedCondition || book.condition === selectedCondition;
    
    return matchesSearch && matchesGenre && matchesCondition;
  });

  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      try {
        await deleteBook(bookId);
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  };

  const getConditionStars = (condition: string) => {
    const starCounts = {
      excellent: 5,
      good: 4,
      fair: 3,
      poor: 2,
    };
    return starCounts[condition as keyof typeof starCounts] || 0;
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'info';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'error';
      default:
        return 'default';
    }
  };

  const genres = [...new Set(books.map(book => book.genre).filter(Boolean))];
  const totalBooks = books.length;
  const genreCount = genres.length;
  const avgCondition = totalBooks > 0 ? books.reduce((acc, book) => acc + getConditionStars(book.condition), 0) / totalBooks : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Personal Library</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Organize, track, and manage your book collection with ease
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Database Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshBooks}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hover>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Book className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{totalBooks}</p>
              </div>
            </div>
          </Card>
          
          <Card hover>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Genres</p>
                <p className="text-2xl font-bold text-gray-900">{genreCount}</p>
              </div>
            </div>
          </Card>
          
          <Card hover>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Condition</p>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(avgCondition)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>

              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Conditions</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>

              <Button
                variant="primary"
                onClick={() => onNavigate('add-book')}
                className="whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </div>
          </div>
        </Card>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <Card className="text-center py-16">
            <Book className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {totalBooks === 0 ? 'No books in your library yet' : 'No books match your filters'}
            </h3>
            <p className="text-gray-600 mb-6">
              {totalBooks === 0 
                ? 'Start building your personal library by adding your first book!'
                : 'Try adjusting your search terms or filters to find what you\'re looking for.'
              }
            </p>
            {totalBooks === 0 && (
              <Button
                variant="primary"
                onClick={() => onNavigate('add-book')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Book
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => (
              <Card key={book.id} hover className="group">
                {/* Book Cover */}
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors" />
                  <div className="text-6xl font-bold text-blue-200 group-hover:text-blue-300 transition-colors">
                    {book.title.charAt(0)}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant={getConditionColor(book.condition)} className="capitalize">
                      {book.condition}
                    </Badge>
                  </div>
                </div>

                {/* Book Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                  </div>

                  {/* Condition Stars */}
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < getConditionStars(book.condition)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 capitalize">{book.condition}</span>
                  </div>

                  {/* Genre */}
                  {book.genre && (
                    <Badge variant="info" size="sm">
                      {book.genre}
                    </Badge>
                  )}

                  {/* Description */}
                  {book.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {book.description}
                    </p>
                  )}

                  {/* Notes */}
                  {book.notes && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800 italic">
                        "{book.notes}"
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => handleDeleteBook(book.id, book.title)}
                      disabled={isLoading}
                      className="bg-red-100 text-red-700 px-3 py-2 rounded-xl text-sm hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>

                  {/* Date Added */}
                  <div className="flex items-center space-x-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <Calendar className="h-3 w-3" />
                    <span>Added {new Date(book.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}