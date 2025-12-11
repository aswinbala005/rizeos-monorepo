import { cn } from "@/lib/utils";

// CORRECTED HIERARCHY: Red -> Orange -> Yellow -> Green
const getMatchColor = (score: number) => {
  if (score >= 85) return "bg-green-100 text-green-800 border-green-200"; // High (Green)
  if (score >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200"; // Good (Yellow)
  if (score >= 50) return "bg-orange-100 text-orange-800 border-orange-200"; // Okay (Orange)
  return "bg-red-100 text-red-800 border-red-200"; // Low (Red)
};

export const MatchBadge = ({ score }: { score: number }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        getMatchColor(score)
      )}
    >
      {score}% Match
    </div>
  );
};