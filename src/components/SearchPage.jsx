// src/components/SearchPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import BookCard from './BookCard';
import axios from 'axios';

const SearchPage = ({ onBookClick }) => {  // ← Added onBookClick prop
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  const fetchBooks = useCallback(async (query) => {
    if (!query.trim()) {
      setBooks([]);
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `https://litshelf-server.onrender.com/api/books/search?q=${encodeURIComponent(query)}`,
        { timeout: 15000 }
      );

      const data = response.data || [];
      setBooks(Array.isArray(data) ? data : []);
      
      if (data.length === 0) {
        setError('No books found for this search');
      }
    } catch (err) {
      console.error('Search error:', err);
      const msg = err.response?.data?.Message || 
                  err.response?.data?.message || 
                  'Failed to search books. Please try again.';
      setError(msg);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Debounce search – wait 400ms after typing stops
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      fetchBooks(searchQuery);
    }, 400);

    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchBooks]);

  // New handler: redirect to book detail page
  const handleViewBook = (book) => {
    if (onBookClick) {
      onBookClick(book);  // Uses the prop from App.jsx → navigates to /book-detail
    } else {
      console.warn('onBookClick prop not available');
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-6 h-6" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, authors, or keywords..."
            className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-lg shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Results / Loading / Error */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Searching books...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl text-center max-w-3xl mx-auto">
          {error}
        </div>
      )}

      {!loading && !error && books.length === 0 && searchQuery && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          No books found for "{searchQuery}". Try different keywords.
        </div>
      )}

      {!loading && books.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="cursor-pointer group"
            >
              <BookCard
                book={{
                  id: book.id,
                  title: book.title,
                  author: book.author,
                  cover: book.coverUrl || 'https://placehold.co/300x450?text=No+Cover&font=roboto',
                  rating: book.averageRating || 0,
                }}
                compact
              />
              <div className="mt-2 text-center">
                <button
                  onClick={() => handleViewBook(book)}  // ← Changed to redirect to detail page
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm transition-colors"
                >
                  View Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!searchQuery && !loading && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          Enter a search term to discover books
        </div>
      )}
    </div>
  );
};

export default SearchPage;