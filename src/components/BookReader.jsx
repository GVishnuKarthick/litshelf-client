import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronLeft, ChevronRight, BookOpen, 
  Settings, Bookmark, BookmarkCheck, 
  Minus, Plus, Type, Sun, Moon, 
  AlignLeft, AlignJustify, Home, 
  FileText, Save
} from 'lucide-react';
import axios from 'axios';

const BookReader = ({ book, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [theme, setTheme] = useState('sepia'); // sepia, white, dark, night
  const [bookmarks, setBookmarks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const contentRef = useRef(null);
  const [bookContent, setBookContent] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (!book) return;
    
    // Load bookmarks and notes from localStorage
    const savedBookmarks = localStorage.getItem(`bookmarks_${book.id}`);
    const savedNotes = localStorage.getItem(`notes_${book.id}`);
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    
    // Load reading position
    const savedPage = localStorage.getItem(`page_${book.id}`);
    if (savedPage) setCurrentPage(parseInt(savedPage, 10));
    
    // Load reading settings
    const savedFontSize = localStorage.getItem('reader_fontSize');
    const savedLineHeight = localStorage.getItem('reader_lineHeight');
    const savedTheme = localStorage.getItem('reader_theme');
    if (savedFontSize) setFontSize(parseInt(savedFontSize, 10));
    if (savedLineHeight) setLineHeight(parseFloat(savedLineHeight));
    if (savedTheme) setTheme(savedTheme);
    
    // Fetch book content if available
    loadBookContent();
  }, [book]);

  useEffect(() => {
    // Save reading position
    if (book?.id) {
      localStorage.setItem(`page_${book.id}`, currentPage.toString());
    }
  }, [currentPage, book]);

  useEffect(() => {
    // Save settings
    localStorage.setItem('reader_fontSize', fontSize.toString());
    localStorage.setItem('reader_lineHeight', lineHeight.toString());
    localStorage.setItem('reader_theme', theme);
  }, [fontSize, lineHeight, theme]);

  const loadBookContent = async () => {
    if (!book?.webReaderLink && !book?.previewLink) {
      // If no reader link, create sample content from description
      if (book?.description) {
        const words = book.description.split(' ');
        const pages = [];
        const wordsPerPage = 250;
        
        for (let i = 0; i < words.length; i += wordsPerPage) {
          pages.push(words.slice(i, i + wordsPerPage).join(' '));
        }
        
        setBookContent(pages.join('\n\n'));
        setTotalPages(pages.length);
      } else {
        setBookContent('This book is available for reading. Content will be displayed here when available.');
        setTotalPages(1);
      }
      return;
    }

    // Try to load from Google Books preview
    try {
      const readerUrl = book.webReaderLink || book.previewLink;
      if (readerUrl) {
        // For now, we'll use the iframe approach but enhance it
        setBookContent('Loading book content...');
      }
    } catch (err) {
      console.error('Error loading book content:', err);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
      setShowNoteInput(true);
    }
  };

  const addBookmark = () => {
    const newBookmark = {
      id: Date.now(),
      page: currentPage,
      timestamp: new Date().toISOString()
    };
    const updated = [...bookmarks, newBookmark];
    setBookmarks(updated);
    localStorage.setItem(`bookmarks_${book.id}`, JSON.stringify(updated));
  };

  const removeBookmark = (bookmarkId) => {
    const updated = bookmarks.filter(b => b.id !== bookmarkId);
    setBookmarks(updated);
    localStorage.setItem(`bookmarks_${book.id}`, JSON.stringify(updated));
  };

  const addNote = () => {
    if (!selectedText && !currentNote.trim()) return;
    
    const newNote = {
      id: Date.now(),
      page: currentPage,
      text: selectedText || currentNote,
      note: currentNote,
      timestamp: new Date().toISOString()
    };
    const updated = [...notes, newNote];
    setNotes(updated);
    localStorage.setItem(`notes_${book.id}`, JSON.stringify(updated));
    setCurrentNote('');
    setSelectedText('');
    setShowNoteInput(false);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  };

  const getThemeClasses = () => {
    const themes = {
      sepia: 'bg-amber-50 text-amber-900',
      white: 'bg-white text-gray-900',
      dark: 'bg-gray-800 text-gray-100',
      night: 'bg-gray-950 text-gray-200'
    };
    return themes[theme] || themes.sepia;
  };

  const currentPageBookmarks = bookmarks.filter(b => b.page === currentPage);
  const currentPageNotes = notes.filter(n => n.page === currentPage);

  if (!book) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 ${getThemeClasses()} flex flex-col transition-colors`}
      onClick={() => setShowControls(!showControls)}
    >
      {/* Header - Show/Hide on click */}
      {showControls && (
        <div className="bg-black/80 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-semibold">{book.title}</h2>
              <p className="text-gray-300 text-sm">{book.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBookmarks(!showBookmarks)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors relative"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {bookmarks.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-50 w-64 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Reading Settings</h3>
          
          {/* Font Size */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Size: {fontSize}px
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="p-1 bg-gray-200 dark:bg-gray-700 rounded"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${((fontSize - 12) / 12) * 100}%` }}
                />
              </div>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="p-1 bg-gray-200 dark:bg-gray-700 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Line Height */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Line Spacing: {lineHeight.toFixed(1)}
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLineHeight(Math.max(1.0, lineHeight - 0.1))}
                className="p-1 bg-gray-200 dark:bg-gray-700 rounded"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${((lineHeight - 1.0) / 1.0) * 100}%` }}
                />
              </div>
              <button
                onClick={() => setLineHeight(Math.min(2.5, lineHeight + 0.1))}
                className="p-1 bg-gray-200 dark:bg-gray-700 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Sepia', value: 'sepia', icon: Sun },
                { name: 'White', value: 'white', icon: Sun },
                { name: 'Dark', value: 'dark', icon: Moon },
                { name: 'Night', value: 'night', icon: Moon }
              ].map(({ name, value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    theme === value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bookmarks Panel */}
      {showBookmarks && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-50 w-64 border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Bookmarks</h3>
          {bookmarks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No bookmarks yet</p>
          ) : (
            <div className="space-y-2">
              {bookmarks.map(bookmark => (
                <div
                  key={bookmark.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <button
                    onClick={() => goToPage(bookmark.page)}
                    className="text-left flex-1"
                  >
                    <span className="text-sm font-medium">Page {bookmark.page}</span>
                  </button>
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Note Input */}
      {showNoteInput && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-50 w-96 border border-gray-200 dark:border-gray-700">
          <div className="mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Selected: "{selectedText.substring(0, 50)}..."
            </p>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Add your note..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows="3"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addNote}
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Save Note
            </button>
            <button
              onClick={() => {
                setShowNoteInput(false);
                setCurrentNote('');
                setSelectedText('');
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reader Content */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto px-8 md:px-16 lg:px-32 py-8"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
          fontFamily: 'Georgia, serif'
        }}
        onMouseUp={handleTextSelection}
      >
        {book.webReaderLink || book.previewLink ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-8 max-w-2xl">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Read on Google Books</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                Google Books doesn't allow embedding their content directly. 
                Click the button below to open this book's preview in a new tab.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {book.previewLink && (
                  <a
                    href={book.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
                  >
                    <BookOpen className="w-5 h-5" />
                    Open Preview on Google Books
                  </a>
                )}
                {book.webReaderLink && book.webReaderLink !== book.previewLink && (
                  <a
                    href={book.webReaderLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                  >
                    <FileText className="w-5 h-5" />
                    Open Web Reader
                  </a>
                )}
                {book.infoLink && (
                  <a
                    href={book.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                  >
                    View Book Info
                  </a>
                )}
              </div>
              <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Note:</strong> While reading on Google Books, you can still use this app to track your reading progress, add bookmarks, and take notes.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
              <p className="text-xl mb-8">by {book.author}</p>
            </div>
            
            {book.description ? (
              <div className="prose prose-lg max-w-none">
                {book.description.split('\n\n').map((para, idx) => (
                  <p key={idx} className="mb-6 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-lg leading-relaxed">
                This book is available for reading. The full content will be displayed here when available.
                You can use the settings to customize your reading experience with different fonts, themes, and spacing.
              </p>
            )}

            {/* Current Page Notes */}
            {currentPageNotes.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
                <h3 className="font-bold mb-4">Your Notes on This Page</h3>
                {currentPageNotes.map(note => (
                  <div key={note.id} className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm italic mb-2">"{note.text}"</p>
                    <p className="text-sm">{note.note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Controls - Show/Hide on click */}
      {showControls && (
        <div className="bg-black/80 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {currentPageBookmarks.length > 0 ? (
              <button
                onClick={() => removeBookmark(currentPageBookmarks[0].id)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Remove bookmark"
              >
                <BookmarkCheck className="w-5 h-5 text-yellow-400" />
              </button>
            ) : (
              <button
                onClick={addBookmark}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Add bookmark"
              >
                <Bookmark className="w-5 h-5" />
              </button>
            )}
            <div className="w-32 h-2 bg-gray-700 rounded-full">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              />
            </div>
            <span className="text-sm">
              {Math.round((currentPage / totalPages) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookReader;
