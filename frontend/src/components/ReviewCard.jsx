import RatingStars from './RatingStars';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-4">
        <img 
          src={review.userImage || 'https://via.placeholder.com/50'} 
          alt={review.userName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-text">{review.userName}</h4>
              <p className="text-sm text-gray-500">{review.date}</p>
            </div>
            <RatingStars rating={review.rating} size="sm" />
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
