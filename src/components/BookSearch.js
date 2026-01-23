import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchBooks = async (newQuery = query, append = false) => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`https://litshelf-server.onrender.com/api/books/search?query=${newQuery}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (append) setBooks([...books, ...res.data]);
    else setBooks(res.data);
    setHasMore(res.data.length > 0);
  };

  useEffect(() => { if (query) searchBooks(query); }, [query]);

  return (
    // Paste Claude's JSX here, e.g.:
    <div className="p-4">
      <input 
        type="text" 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        className="mb-4 p-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white w-full" 
        placeholder="Search books..." 
      />
      <InfiniteScroll 
        dataLength={books.length} 
        next={() => { setPage(page + 1); searchBooks(query, true); }} 
        hasMore={hasMore} 
        loader={<h4 className="text-center">Loading...</h4>}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map(book => (
            <div key={book.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <img src={book.coverUrl} alt={book.title} className="w-full h-48 object-cover mb-2" />
              <h3 className="text-lg font-bold dark:text-white">{book.title}</h3>
              <p className="dark:text-gray-300">{book.author}</p>
              <button onClick={() => addToList(book)} className="mt-2 bg-blue-500 text-white p-2 rounded">Add to List</button>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default BookSearch;