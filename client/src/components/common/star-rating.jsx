import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange, size = "default" }) {
  const safeRating = Number(rating) || 0;

  return [1, 2, 3, 4, 5].map((star) => {
    const isActive = star <= safeRating;

    // Read-only variant (no click handler) — render plain icons without button wrappers.
    if (!handleRatingChange) {
      const iconSizeClass = size === "small" ? "w-4 h-4" : "w-6 h-6";
      const colorClass = isActive ? "text-yellow-500 fill-yellow-500" : "text-gray-300 fill-gray-300";
      return (
        <span key={star} className="inline-flex mr-0.5">
          <StarIcon className={`${iconSizeClass} ${colorClass}`} />
        </span>
      );
    }

    // Interactive buttons when a handler is provided
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
        onClick={() => handleRatingChange(star)}
      >
        <StarIcon
          className={`w-6 h-6 ${isActive ? "fill-yellow-500" : "fill-black"}`}
        />
      </Button>
    );
  });
}

export default StarRatingComponent;
