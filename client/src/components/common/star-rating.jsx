import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange, size = "default" }) {
  const safeRating = Number(rating) || 0;

  return [1, 2, 3, 4, 5].map((star) => {
    const isActive = star <= safeRating;

    // Compact, read-only variant (used in admin reviews list)
    if (size === "small" && !handleRatingChange) {
      return (
        <span key={star} className="inline-flex mr-0.5">
          <StarIcon
            className={`w-4 h-4 ${
              isActive ? "text-yellow-500 fill-yellow-500" : "text-gray-300 fill-gray-300"
            }`}
          />
        </span>
      );
    }

    // Default interactive buttons (existing behaviour)
    return (
      <Button
        key={star}
        className={`p-2 rounded-full transition-colors ${
          isActive
            ? "text-yellow-500 hover:bg-black"
            : "text-black hover:bg-primary hover:text-primary-foreground"
        }`}
        variant="outline"
        size="icon"
        onClick={handleRatingChange ? () => handleRatingChange(star) : null}
      >
        <StarIcon
          className={`w-6 h-6 ${
            isActive ? "fill-yellow-500" : "fill-black"
          }`}
        />
      </Button>
    );
  });
}

export default StarRatingComponent;
