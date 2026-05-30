
import { useNavigate } from "react-router-dom";
import {puzzles} from "../data/puzzle-data";


function Puzzle() {
  const navigate = useNavigate();

  return (
    <div className="puzzle">
        <button className="back-btn" onClick={() => navigate("/")}>
            <span className="back-arrow">←</span>
            <span>Back</span>
        </button>

        <h1 className = "puzzle-title font-press-start">Choose The Puzzle</h1>

        <div className="puzzle-grid">
            {puzzles.map((puzzle) => {
                return(               
                    <button className={`puzzle-card ${puzzle.locked ? "puzzle-card-locked" : ""}`} key={puzzle.title}>
                        <span className={`puzzle-level ${puzzle.level === "Intermediate" ? "puzzle-level-intermediate" : "" }`}> {puzzle.level} </span>
                        <h2 className="puzzle-card-title font-press-start"> {puzzle.title} </h2>
                        <p className="puzzle-card-description"> {puzzle.description} </p>
                    </button>
                );
            })}
        </div>
    </div>
  );
}

export default Puzzle;
