import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cat from "../assets/cat.png";
import platform from "../assets/pot_plant.png";
import { PUZZLES } from "../game/data/puzzles";
import { getCompletedPuzzles, resetCompletedPuzzles } from "../game/lib/puzzle-progress";

function Puzzle() {

  const navigate = useNavigate();

  const [completed, setCompleted] = useState(() => getCompletedPuzzles());

  function goHome() {
    navigate("/");
  }

  function openPuzzle(puzzleId: number) {
    navigate(`/puzzle/${puzzleId}`);
  }

  function handleResetAll() {
    if (window.confirm("Reset all puzzle progress? This will unlock from the beginning.")) {
      resetCompletedPuzzles();
      setCompleted(new Set());
    }
  }

  function getDifficultyClass(difficulty: string) {
    if (difficulty === "intermediate") return "puzzle-level-intermediate";
    if (difficulty === "advanced") return "puzzle-level-advanced";
    return "";
  }

  return (
    <div className="puzzle">

      <div className="puzzle-topbar">

        <button className="puzzle-back-btn" type="button" onClick={goHome}>
          <span className="back-arrow">←</span>

          <span>Back</span>
        </button>

        <h1 className="puzzle-title font-press-start">Choose The Puzzle</h1>

        <button className="puzzle-reset-btn" type="button" onClick={handleResetAll}>
          Reset Progress
        </button>

      </div>

      <div className="puzzle-grid">

        {PUZZLES.map((puzzle, index) => {

          const isDone = completed.has(puzzle.id);
          const previousPuzzle = PUZZLES[index - 1];
          const isLocked = index > 0 && !completed.has(previousPuzzle.id);

          return (
            <button
              className={`puzzle-card ${isLocked ? "puzzle-card-locked" : ""} ${isDone ? "puzzle-card-done" : ""}`}
              type="button"
              key={puzzle.title}
              disabled={isLocked}
              onClick={() => openPuzzle(puzzle.id)}
            >
              <span className={`puzzle-level ${getDifficultyClass(puzzle.difficulty)}`}>
                {isDone ? "Completed" : puzzle.difficulty}
              </span>

              <h2 className="puzzle-card-title font-press-start">{puzzle.title}</h2>

              <p className="puzzle-card-description">{puzzle.tagline}</p>

            </button>
          );

        })}
      </div>

      <img className="puzzle-decor puzzle-cat" src={cat} alt="" draggable="false" />
      <img className="puzzle-decor puzzle-platform-left" src={platform} alt="" draggable="false" />
      <img className="puzzle-decor puzzle-platform-right" src={platform} alt="" draggable="false" />

    </div>
  );
}

export default Puzzle;
