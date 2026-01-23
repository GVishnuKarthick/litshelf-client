import React from 'react';
import StarRating from './StarRating';

const BookCard = ({ book, onClick, compact = false }) => {
  return (
    <div
      onClick={onClick}
      className={`
        group cursor-pointer rounded-xl overflow-hidden
        transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
        ${compact ? '' : 'bg-white dark:bg-gray-900'}
      `}
    >
      <div className="relative overflow-hidden aspect-[2/3]">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {book.progress > 0 && book.progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
              style={{ width: `${book.progress}%` }}
            />
          </div>
        )}
        {book.progress === 100 && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Finished
          </div>
        )}
      </div>
      {!compact && (
        <div className="p-3 md:p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 text-sm md:text-base">
            {book.title}
          </h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
            {book.author}
          </p>
          <StarRating rating={book.rating} size="sm" />
        </div>
      )}
      
    </div>
    
  );
};

export default BookCard;