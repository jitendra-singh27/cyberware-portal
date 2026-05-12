import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

export function getSeverityColor(severity: string) {
  switch (severity?.toLowerCase()) {
    case "critical": return "bg-destructive/20 text-destructive border-destructive/30";
    case "high":     return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "medium":   return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "low":      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:         return "bg-muted text-muted-foreground border-border";
  }
}

export function getDifficultyColor(diff: string) {
  switch (diff?.toLowerCase()) {
    case "beginner":     return "text-accent border-accent/30 bg-accent/10";
    case "intermediate": return "text-primary border-primary/30 bg-primary/10";
    case "advanced":     return "text-purple-400 border-purple-400/30 bg-purple-400/10";
    default:             return "text-muted-foreground border-border bg-muted/50";
  }
}
