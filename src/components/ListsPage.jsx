// src/components/ListsPage.jsx
import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, BookOpen, CheckSquare, Square } from 'lucide-react';
import BookCard from './BookCard';
import axios from 'axios';

const ListsPage = ({ onBookClick }) => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New states for multi-select delete
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your reading lists');
        return;
      }

      const response = await axios.get('https://litshelf-server.onrender.com/api/readinglists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLists(response.data || []);
    } catch (err) {
      console.error('Error fetching lists:', err);
      let msg = 'Failed to load your reading lists';
      if (err.response?.status === 401)  localStorage.removeItem('token');
      else if (err.response?.status === 500) msg = 'Server error – please try again later';
      else if (err.response?.data?.Message) msg = err.response.data.Message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    setError('');
    if (!newListName.trim()) {
      setError('List name is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to create a new list');
        return;
      }

      await axios.post(
        'https://litshelf-server.onrender.com/api/readinglists',
        { name: newListName.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setNewListName('');
      setShowNewListModal(false);
      fetchLists();
    } catch (err) {
      console.error('Error creating list:', err);
      let msg = 'Failed to create list';
      if (err.response?.status === 401) localStorage.removeItem('token');
      else if (err.response?.data?.Message) msg = err.response.data.Message;
      setError(msg);
    }
  };

  const handleDeleteList = async (listId, listName) => {
    if (!window.confirm(`Delete "${listName}"? This cannot be undone.`)) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to delete lists');
        return;
      }

      await axios.delete(`https://litshelf-server.onrender.com/api/readinglists/${listId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchLists();
      setSelectedList(null);
      alert(`"${listName}" deleted`);
    } catch (err) {
      console.error('Delete failed:', err);
      let msg = 'Failed to delete list';
      if (err.response?.status === 401)  localStorage.removeItem('token');
      else if (err.response?.data?.Message) msg = err.response.data.Message;
      setError(msg);
    }
  };

  const handleOpenList = (list) => {
    if (!selectionMode) {
      setSelectedList(list);
      setSelectedItems(new Set()); // Reset selection when opening a new list
    }
  };

  const handleCloseListDetail = () => {
    setSelectedList(null);
    setSelectionMode(false);
    setSelectedItems(new Set());
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedItems(new Set()); // Clear selection when exiting mode
    }
  };

  // Toggle individual book selection
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Delete selected items
  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;

    if (!window.confirm(`Delete ${selectedItems.size} selected book(s)? This cannot be undone.`)) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to delete books');
        return;
      }

      // Delete each selected item one by one (or batch if backend supports)
      for (const itemId of selectedItems) {
        await axios.delete(`https://litshelf-server.onrender.com/api/readinglists/item/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Refresh the list
      await fetchLists();
      // Update selectedList with new items
      setSelectedList(prev => ({
        ...prev,
        items: prev.items.filter(item => !selectedItems.has(item.id))
      }));

      setSelectedItems(new Set());
      setSelectionMode(false);
      alert(`${selectedItems.size} book(s) removed successfully`);
    } catch (err) {
      console.error('Delete selected failed:', err);
      let msg = 'Failed to delete selected books';
      if (err.response?.status === 401)  localStorage.removeItem('token');
      else if (err.response?.data?.Message) msg = err.response.data.Message;
      setError(msg);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your reading lists...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          My Reading Lists
        </h1>
        <button
          onClick={() => setShowNewListModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New List
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {/* New List Modal */}
      {showNewListModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Create New List
              </h2>
              <button
                onClick={() => {
                  setShowNewListModal(false);
                  setNewListName('');
                  setError('');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateList}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  List Name
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g., Want to Read, Favorites, To Read Soon"
                  className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  autoFocus
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewListModal(false);
                    setNewListName('');
                    setError('');
                  }}
                  className="flex-1 px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List Detail View */}
      {selectedList ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {selectedList.name}
            </h2>
            <div className="flex items-center gap-3">
              {/* Select / Delete / Cancel Buttons */}
              {selectionMode ? (
                <>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedItems.size === 0}
                    className={`px-5 py-2 rounded-lg font-medium transition-all ${
                      selectedItems.size > 0
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                        : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    }`}
                  >
                    Delete ({selectedItems.size})
                  </button>
                  <button
                    onClick={toggleSelectionMode}
                    className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleSelectionMode}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-md"
                >
                  Select
                </button>
              )}

              <button
                onClick={handleCloseListDetail}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {selectedList.items?.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                This list is empty
              </p>
              <button
                onClick={handleCloseListDetail}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Back to Lists
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {selectedList.items
                .filter(item => item.book && item.book.id)
                .map((item) => {
                  const book = item.book;
                  const isSelected = selectedItems.has(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`relative cursor-pointer transform transition-transform hover:scale-105 group ${
                        selectionMode ? 'hover:ring-2 hover:ring-red-500 rounded-xl' : ''
                      }`}
                      onClick={(e) => {
                        if (selectionMode) {
                          e.stopPropagation();
                          toggleItemSelection(item.id);
                        } else {
                          e.stopPropagation();
                          onBookClick(book);
                        }
                      }}
                    >
                      {selectionMode && (
                        <div className="absolute top-2 right-2 z-10">
                          {isSelected ? (
                            <CheckSquare className="w-6 h-6 text-red-600 bg-white dark:bg-gray-900 rounded-full" />
                          ) : (
                            <Square className="w-6 h-6 text-gray-400 bg-white dark:bg-gray-900 rounded-full" />
                          )}
                        </div>
                      )}

                      <BookCard
                        book={{
                          id: book.id,
                          title: book.title || 'Title Missing',
                          author: book.author || 'Author Missing',
                          cover: book.coverUrl || 'https://placehold.co/300x450?text=No+Cover&font=roboto',
                          rating: book.averageRating || 0,
                          progress: item.progress || 0
                        }}
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      ) : (
        /* Normal list grid view */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xl transition-all duration-300 group relative cursor-pointer"
              onClick={() => handleOpenList(list)}
            >
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteList(list.id, list.name);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Delete list"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="relative h-48 mb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden">
                {(list.items || []).slice(0, 3).map((item, i) => {
                  const book = item.book || {};
                  return (
                    <div
                      key={i}
                      className="absolute w-32 h-48 rounded-xl overflow-hidden shadow-lg transition-transform group-hover:scale-110"
                      style={{
                        transform: `translateX(${(i - 2) * 18}px) rotate(${(i - 2) * 4}deg)`,
                        zIndex: 5 - i,
                      }}
                    >
                      <img
                        src={book.coverUrl || 'https://placehold.co/300x450?text=No+Cover&font=roboto'}
                        alt={book.title || 'Book cover'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/300x450?text=Image+Error&font=roboto';
                        }}
                      />
                    </div>
                  );
                })}
                {(list.items || []).length === 0 && (
                  <div className="text-gray-400 dark:text-gray-600 text-lg font-medium flex flex-col items-center">
                    <BookOpen className="w-10 h-10 mb-2 opacity-50" />
                    No books yet
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {list.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {(list.items || []).length}
                </span>{' '}
                {(list.items || []).length === 1 ? 'book' : 'books'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListsPage;