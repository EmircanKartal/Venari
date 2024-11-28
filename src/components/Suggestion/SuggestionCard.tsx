// src/components/Suggestion/SuggestionCard.tsx
import { FaBookmark } from "react-icons/fa";

const SuggestionCard = ({
  title,
  imageSrc,
}: {
  title: string;
  imageSrc: string;
}) => {
  const handleBookmarkClick = () => {
    alert(`${title} is added to bookmarked event list!`);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md">
      <img src={imageSrc} alt={title} className="w-full h-40 object-cover" />
      <button
        onClick={handleBookmarkClick}
        className="absolute top-2 right-2 p-1.5 bg-[#fffbca] rounded-full shadow"
      >
        <FaBookmark size={14} className="text-[#ffc73b]" />
      </button>
      <div className="absolute bottom-2 left-2 px-3 py-1.5 bg-black bg-opacity-75 text-white text-sm rounded-2xl font-semibold truncate max-w-full">
        {title.length > 30 ? `${title.substring(0, 27)}...` : title}
      </div>
    </div>
  );
};

export default SuggestionCard;
