import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import { BookOpen, ChevronRight } from 'lucide-react';
import axios from 'axios';

const HomePage = ({ onBookClick }) => {
  const [userName, setUserName] = useState('Reader');
  const [booksByCategory, setBooksByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'Tamil', query: 'tamil' },
    { name: 'English', query: 'english' },
    { name: 'Fiction', query: 'fiction' },
    { name: 'Non-Fiction', query: 'nonfiction' },
    { name: 'Science', query: 'science' },
    { name: 'History', query: 'history' }
  ];

  useEffect(() => {
    // Load name once + listen for changes
    const updateName = () => {
      const name = localStorage.getItem('userName') || 'Reader';
      setUserName(name);
    };

    updateName();

    window.addEventListener('storage', updateName);
    window.addEventListener('localStorageChange', updateName);

    return () => {
      window.removeEventListener('storage', updateName);
      window.removeEventListener('localStorageChange', updateName);
    };
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      const booksData = {};

      try {
        await Promise.all(
          categories.map(async (category) => {
            try {
              const response = await axios.get(
                `https://litshelf-server.onrender.com/api/books/discover?category=${category.query}&maxResults=10`,
                { timeout: 30000 }
              );
              booksData[category.name] = Array.isArray(response.data) ? response.data : [];
            } catch (err) {
              console.error(`Error fetching ${category.name} books:`, err);
              booksData[category.name] = [];
            }
          })
        );
        setBooksByCategory(booksData);
      } catch (err) {
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    
    <div className="space-y-10">
      {/* Personalized Welcome */}
      <div className="text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Hello {userName}, Welcome back!
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          Discover your next favorite book
        </p>
      </div>
        
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-8 text-white">
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold mb-2">Discover Your Next Read! 📚</h2>
          <p className="text-emerald-50 mb-6">Explore books from different categories and languages</p>
        </div>
      </div>

      {/* Books by Category */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">Loading your books...</p>
        </div>
      ) : (
        categories.map((category) => {
          const books = booksByCategory[category.name] || [];
          if (books.length === 0) return null;

          return (
            <section key={category.name} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {category.name} Books
                </h2>
                <button className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2 hover:gap-3 transition-all">
                  View All <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
                {books.slice(0, 10).map((book) => (
                  <BookCard
                    key={book.id}
                    book={{
                      id: book.id,
                      title: book.title,
                      author: book.author,
                      cover: book.coverUrl || 'https://placehold.co/300x450?text=No+Cover&font=roboto',
                      rating: book.averageRating || 0,
                      progress: 0
                    }}
                    onClick={() =>
                      onBookClick({
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        cover: book.coverUrl,
                        description: book.description,
                        rating: book.averageRating || 0,
                        previewLink: book.previewLink,
                        webReaderLink: book.webReaderLink,
                        epubLink: book.epubLink,
                        pdfLink: book.pdfLink,
                        pageCount: book.pageCount,
                        publishedDate: book.publishedDate,
                        publisher: book.publisher,
                        categories: book.categories || []
                      })
                    }
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
};

export default HomePage;