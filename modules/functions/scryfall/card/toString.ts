import { Card } from "@/types/Scryfall/Card";
export function toString(card: Card): string {
  return `${card.collector_number}-${card.name
    .replace(/[\/]/g, "")
    .replace(/[']/g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .join("-")
    .toLowerCase()}`;
}
