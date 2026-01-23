// src/components/BookDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StarRating from './StarRating'; // Assuming you have this component

// Fallback book (used if no data at all)
const FALLBACK_BOOK = {
  id: 'fallback',
  title: 'Book Not Found',
  author: 'Unknown',
  cover: 'https://placehold.co/300x450?text=No+Cover&font=roboto',
  rating: 0,
  description: 'No description available.',
  pageCount: 'N/A',
  publishedDate: 'N/A',
  categories: [],
  previewLink: '',
  webReaderLink: '',
  infoLink: ''
};

const BookDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialBook = location.state?.book || FALLBACK_BOOK;

  const [book, setBook] = useState(initialBook);
  const [loading, setLoading] = useState(!initialBook.description && initialBook.id !== 'fallback');
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');
  const [addError, setAddError] = useState('');

  useEffect(() => {
    // Redirect if no book data at all
    if (!initialBook || !initialBook.id || initialBook.id === 'fallback') {
      navigate('/');
      return;
    }

    // Fetch full book details if we only have partial data from lists
    if (initialBook.id && (!initialBook.description || !initialBook.pageCount || !initialBook.categories?.length)) {
      fetchFullBookDetails();
    } else {
      setLoading(false);
    }

    // Load user's reading lists for "Add to List" dropdown
    fetchUserLists();
  }, [initialBook.id, navigate]);

  const fetchFullBookDetails = async () => {
    try {
      setLoading(true);
      // Replace with your actual Google Books API key or config
      const apiKey = 'AIzaSyAYrYkFGf2o1wRnKYaTLYDZXLZGF72yXzw'; // ← Add your key here or from env
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes/${initialBook.id}?key=${apiKey}`
      );

      const volumeInfo = response.data.volumeInfo || {};
      const accessInfo = response.data.accessInfo || {};

      setBook({
        ...initialBook,
        title: volumeInfo.title || initialBook.title || 'Title Missing',
        author: volumeInfo.authors?.[0] || initialBook.author || 'Author Missing',
        description: volumeInfo.description || 'No detailed description available.',
        cover: volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') || 
               volumeInfo.imageLinks?.smallThumbnail?.replace('http://', 'https://') || 
               initialBook.cover,
        pageCount: volumeInfo.pageCount || 'N/A',
        publishedDate: volumeInfo.publishedDate || 'N/A',
        categories: volumeInfo.categories || [],
        averageRating: volumeInfo.averageRating || initialBook.averageRating || 0,
        previewLink: volumeInfo.previewLink || '',
        webReaderLink: accessInfo.webReaderLink || '',
        infoLink: volumeInfo.infoLink || ''
      });
    } catch (err) {
      console.error('Failed to fetch full book details:', err);
      // Keep partial data if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLists = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('https://litshelf-server.onrender.com/api/readinglists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLists(res.data || []);
    } catch (err) {
      console.error('Failed to load lists:', err);
      setAddError('Could not load your lists');
    }
  };

  const handleAddToList = async () => {
    if (!selectedListId) {
      alert('Please select a list first');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add books');
        return;
      }

      const payload = {
        readingListId: parseInt(selectedListId),
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookCoverUrl: book.cover
      };

      await axios.post('https://litshelf-server.onrender.com/api/readinglists/item', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert(`"${book.title}" added successfully!`);
      setSelectedListId('');
    } catch (err) {
      console.error('Add book error:', err.response || err);
      let errorMessage = 'Failed to add book';

      if (err.response) {
        const status = err.response.status;
        const serverMsg = err.response.data?.message || 
                          err.response.data?.Message || 
                          err.response.data?.detail ||
                          err.response.data?.error;

        if (status === 401) localStorage.removeItem('token');
        else if (status === 400) errorMessage = serverMsg || 'Invalid book or list selection';
        else if (status === 404) errorMessage = serverMsg || 'List or book not found';
        else if (status === 500) errorMessage = serverMsg || 'Server error – check backend logs';
        else errorMessage = `${status}: ${serverMsg || err.message}`;
      } else {
        errorMessage = err.message || 'Network error – check connection';
      }

      alert(errorMessage);
    }
  };

  const handleReadBook = () => {
    const link = book.previewLink || book.webReaderLink || book.infoLink;
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      alert('No preview available for this book.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book.id || book.id === 'fallback') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500 text-xl">
          Book not found. <button onClick={() => navigate('/')} className="underline">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 h-[500px] overflow-hidden rounded-b-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-30 scale-110"
          style={{ backgroundImage: `url(${book.cover || 'https://placehold.co/300x450?text=No+Cover&font=roboto'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 dark:via-gray-950/70 to-white dark:to-gray-950" />
        <div className="relative h-full flex flex-col md:flex-row items-center justify-center gap-10 py-12 px-6 sm:px-8 lg:px-10">
          <img
            src={book.cover || 'https://placehold.co/300x450?text=No+Cover&font=roboto'}
            alt={book.title}
            className="w-56 md:w-64 lg:w-72 h-auto object-cover rounded-2xl shadow-2xl ring-1 ring-black/10 dark:ring-white/10 transform hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.target.src = 'https://placehold.co/300x450?text=No+Cover&font=roboto')}
          />

          <div className="flex-1 text-center md:text-left max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
              {book.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
              by {book.author || 'Unknown Author'}
            </p>

            <div className="flex justify-center md:justify-start mb-8">
              <StarRating rating={book.averageRating || book.rating || 0} size="lg" />
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={handleReadBook}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Read Book
              </button>

              {/* Add to List */}
              {lists.length > 0 ? (
                <div className="flex gap-3 items-center">
                  <select
                    value={selectedListId}
                    onChange={(e) => setSelectedListId(e.target.value)}
                    className="px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none min-w-[180px]"
                  >
                    <option value="">Add to list...</option>
                    {lists.map(list => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleAddToList}
                    disabled={!selectedListId}
                    className={`px-8 py-4 font-semibold rounded-xl shadow-lg transform transition-all duration-300 ${
                      selectedListId
                        ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl hover:scale-105'
                        : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    }`}
                  >
                    Add to List
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 self-center">
                  Create a List to add books
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* About This Book */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              About This Book
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {book.description || 'No detailed description available for this book.'}
            </p>
          </section>
        </div>

        {/* Book Details Sidebar */}
        <div className="space-y-8">
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Book Details
            </h3>
            <dl className="space-y-5 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <dt className="font-medium">Pages</dt>
                <dd className="font-semibold">{book.pageCount || 'N/A'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Published</dt>
                <dd className="font-semibold">{book.publishedDate || 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium mb-2">Genres</dt>
                <dd className="flex flex-wrap gap-2">
                  {(book.categories || []).length > 0 ? (
                    book.categories.map((genre, index) => (
                      <span
                        key={index}
                        className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-medium"
                      >
                        {genre}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">No genres listed</span>
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;