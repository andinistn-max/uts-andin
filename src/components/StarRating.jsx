import { Star } from "lucide-react";

// Tanpa onChange = hanya tampilan; dengan onChange = bisa dipilih
export default function StarRating({ value, onChange, size = 18 }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="star-btn"
          disabled={!onChange}
          onClick={() => onChange && onChange(n)}
          aria-label={`${n} bintang`}
        >
          <Star size={size} className={n <= Math.round(value) ? "star on" : "star"} />
        </button>
      ))}
    </div>
  );
}
