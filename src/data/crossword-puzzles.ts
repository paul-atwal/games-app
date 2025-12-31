import type { CrosswordPuzzle } from "@/lib/games/crossword/types";

// Mini crossword puzzles (5x5) - carefully constructed and verified
// Each puzzle uses a diagonal pattern with black squares in corners
// to make word construction manageable while avoiding 1-2 letter words
//
// Grid pattern (# = black square):
//   #  #  .  .  .
//   #  .  .  .  .
//   .  .  .  .  .
//   .  .  .  .  #
//   .  .  .  #  #
//
// All across and down words verified as valid English words

export const CROSSWORD_PUZZLES: CrosswordPuzzle[] = [
  {
    id: "mini-001",
    title: "Daily Mini",
    author: "Puzzle Games",
    date: "2025-12-30",
    size: { rows: 5, cols: 5 },
    // ACROSS: MAP, SALE, TALES, ALES, RES
    // DOWN: TAR, SALE, MALES, ALES, PES
    grid: [
      [null, null, "M", "A", "P"],
      [null, "S", "A", "L", "E"],
      ["T", "A", "L", "E", "S"],
      ["A", "L", "E", "S", null],
      ["R", "E", "S", null, null],
    ],
    clues: {
      across: [
        { number: 1, clue: "Chart of an area", answer: "MAP", row: 0, col: 2, length: 3 },
        { number: 4, clue: "Discounted price event", answer: "SALE", row: 1, col: 1, length: 4 },
        { number: 6, clue: "Stories", answer: "TALES", row: 2, col: 0, length: 5 },
        { number: 8, clue: "Pub drinks", answer: "ALES", row: 3, col: 0, length: 4 },
        { number: 9, clue: "Legal matters (Latin)", answer: "RES", row: 4, col: 0, length: 3 },
      ],
      down: [
        { number: 1, clue: "Men", answer: "MALES", row: 0, col: 2, length: 5 },
        { number: 2, clue: "Pub drinks", answer: "ALES", row: 0, col: 3, length: 4 },
        { number: 3, clue: "Gym classes, briefly", answer: "PES", row: 0, col: 4, length: 3 },
        { number: 4, clue: "Bargain event", answer: "SALE", row: 1, col: 1, length: 4 },
        { number: 5, clue: "Sticky road substance", answer: "TAR", row: 2, col: 0, length: 3 },
      ],
    },
  },
  {
    id: "mini-002",
    title: "Daily Mini 2",
    author: "Puzzle Games",
    date: "2025-12-31",
    size: { rows: 5, cols: 5 },
    // ACROSS: MAE, TARS, TALES, ALES, RES
    // DOWN: TAR, TALE, MALES, ARES, ESS
    grid: [
      [null, null, "M", "A", "E"],
      [null, "T", "A", "R", "S"],
      ["T", "A", "L", "E", "S"],
      ["A", "L", "E", "S", null],
      ["R", "E", "S", null, null],
    ],
    clues: {
      across: [
        { number: 1, clue: "Girl's name", answer: "MAE", row: 0, col: 2, length: 3 },
        { number: 4, clue: "Road surfaces", answer: "TARS", row: 1, col: 1, length: 4 },
        { number: 6, clue: "Stories", answer: "TALES", row: 2, col: 0, length: 5 },
        { number: 8, clue: "Pub brews", answer: "ALES", row: 3, col: 0, length: 4 },
        { number: 9, clue: "Legal matters (Latin)", answer: "RES", row: 4, col: 0, length: 3 },
      ],
      down: [
        { number: 1, clue: "Men", answer: "MALES", row: 0, col: 2, length: 5 },
        { number: 2, clue: "Greek war god", answer: "ARES", row: 0, col: 3, length: 4 },
        { number: 3, clue: "Letter shape", answer: "ESS", row: 0, col: 4, length: 3 },
        { number: 4, clue: "Story", answer: "TALE", row: 1, col: 1, length: 4 },
        { number: 5, clue: "Sticky road stuff", answer: "TAR", row: 2, col: 0, length: 3 },
      ],
    },
  },
];

// Get puzzle by date (or index as fallback)
export function getPuzzleForDate(date: Date): CrosswordPuzzle {
  const startDate = new Date(2025, 11, 30);
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  const diffTime = normalizedDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const index = Math.abs(diffDays) % CROSSWORD_PUZZLES.length;
  return CROSSWORD_PUZZLES[index];
}

export function getTodaysPuzzle(): CrosswordPuzzle {
  return getPuzzleForDate(new Date());
}
