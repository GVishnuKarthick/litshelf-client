import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, size = 'sm', interactive = false, onChange }) => {
  const [hover, setHover] = useState(0);
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`${sizeClass} ${
            (hover || rating) >= star
              ? 'fill-amber-400 text-amber-400'
              : 'text-gray-300 dark:text-gray-600'
          } ${interactive ? 'cursor-pointer' : ''} transition-colors`}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange?.(star)}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;