const PUZZLE_PROGRESS_KEY = "gitbattle-completed-puzzles";

export function getCompletedPuzzles() {
  const saved = localStorage.getItem(PUZZLE_PROGRESS_KEY);

  if (saved == null) {
    return new Set<number>();
  }

  return new Set(JSON.parse(saved) as number[]);
}

export function saveCompletedPuzzle(puzzleId: number) {
  const completed = getCompletedPuzzles();

  completed.add(puzzleId);
  localStorage.setItem(PUZZLE_PROGRESS_KEY, JSON.stringify([...completed]));
}

export function resetCompletedPuzzles() {
  localStorage.removeItem(PUZZLE_PROGRESS_KEY);
}
