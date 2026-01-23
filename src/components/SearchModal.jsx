import React, { useState, useEffect } from 'react';
import { Search, X, Star } from 'lucide-react';
import BookCard from './BookCard';
import axios from 'axios';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        fetchBooks();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setBooks([]);
    }
  }, [searchQuery]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://litshelf-server.onrender.com/api/books/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setBooks(response.data || []);
    } catch (err) {
      console.error('Search error:', err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative min-h-screen px-4 py-8">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl mx-auto border border-gray-200 dark:border-gray-800">
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 rounded-t-2xl">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, authors, ISBN..."
                  autoFocus
                  className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-all text-lg shadow-sm hover:shadow-md"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {searchQuery ? `Results for "${searchQuery}"` : 'Popular Books'}
            </h3>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
              </div>
            ) : books.length === 0 && searchQuery ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                No books found. Try a different search term.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-h-[60vh] overflow-y-auto">
                {books.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => {
                      onClose();
                      window.open(book.previewLink || book.infoLink || book.webReaderLink, '_blank');
                    }}
                    className="cursor-pointer"
                  >
                    <BookCard
                      book={{
                        ...book,
                        cover: book.coverUrl || 'https://placehold.co/300x450?text=No+Cover&font=roboto',
                        rating: book.averageRating || 0,
                      }}
                      compact
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;