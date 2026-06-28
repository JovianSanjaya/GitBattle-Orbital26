import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { executeCommand } from "../game/lib/git-engine";
import { createTerminalLine, getCurrentBranchName } from "../game/lib/commands/helpers";
import { computeLayout } from "../game/lib/graph-layout";
import { saveCompletedPuzzle } from "../game/lib/puzzle-progress";
import { PUZZLES, type Puzzle } from "../game/data/puzzles";
import type { GitState, Graph, Terminal } from "../types/git";
import { useGoogleAuth } from "../auth/google-auth-provider";

type GameInstruction = {
  title: string;
  text: string;
};

const INSTRUCTION_STORAGE_KEY = "gitbattle-game-instructions-seen";

const gameInstructions: GameInstruction[] = [
  {
    title: "Read History",
    text: "Follow the line from older commits to newer commits. The branch label moves as you make changes.",
  },
  {
    title: "Match The Target",
    text: "Use Git commands in the terminal until Your Graph looks like the Target Graph. No need to use git init, git add, or git push.",
  },
];

function getPuzzleFromRoute(id: string | undefined) {
  const puzzleId = Number(id);

  return PUZZLES.find((puzzle) => puzzle.id === puzzleId) ?? PUZZLES[0];
}

function formatDifficulty(difficulty: Puzzle["difficulty"]) {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

function hasSeenInstructions() {
  return sessionStorage.getItem(INSTRUCTION_STORAGE_KEY) === "true";
}

function rememberInstructionsSeen() {
  sessionStorage.setItem(INSTRUCTION_STORAGE_KEY, "true");
}

function Game() {
  const { id } = useParams();
  const puzzle = getPuzzleFromRoute(id);

  return <GameContent key={puzzle.id} puzzle={puzzle} />;
}

type GameContentProps = {
  puzzle: Puzzle;
};

function GameContent({ puzzle }: GameContentProps) {
  const navigate = useNavigate();
  const { user } = useGoogleAuth();

  const [state, setState] = useState<GitState>(() => puzzle.initialState);
  const [history, setHistory] = useState<Terminal[]>([]);
  const [command, setCommand] = useState("");
  const [solved, setSolved] = useState(false);
  const [instructionStep, setInstructionStep] = useState(() => {
    return hasSeenInstructions() ? gameInstructions.length : 0;
  });

  const currentIndex = PUZZLES.findIndex((item) => item.id === puzzle.id);
  const nextPuzzle = PUZZLES[currentIndex + 1];
  const branchName = getCurrentBranchName(state) ?? "HEAD";
  const targetGraph = computeLayout(puzzle.targetState);
  const userGraph = computeLayout(state);
  const instruction = gameInstructions[instructionStep];
  const showInstructions = instructionStep < gameInstructions.length;
  const isLastPuzzle = currentIndex === PUZZLES.length - 1;

  function getCommandCount(nextHistory = history) {
    return nextHistory.filter((line) => line.type === "input").length;
  }

  function reset() {
    setState(puzzle.initialState);
    setHistory([]);
    setCommand("");
    setSolved(false);
  }

  function showHowToPlay() {
    setInstructionStep(0);
  }

  function previousInstruction() {
    setInstructionStep((step) => Math.max(0, step - 1));
  }

  function nextInstruction() {
    if (instructionStep === gameInstructions.length - 1) {
      rememberInstructionsSeen();
    }

    setInstructionStep((step) => step + 1);
  }

  function skipInstructions() {
    rememberInstructionsSeen();
    setInstructionStep(gameInstructions.length);
  }

  function goToNextPuzzle() {
    if (isLastPuzzle || !nextPuzzle) {
      navigate("/puzzle");
      return;
    }

    navigate(`/puzzle/${nextPuzzle.id}`);
  }

  function runCommand() {
    const trimmedCommand = command.trim();

    if (!trimmedCommand) {
      return;
    }

    const inputLine = createTerminalLine("input", trimmedCommand);

    if (solved) {
      setHistory([
        ...history,
        inputLine,
        createTerminalLine("info", "Puzzle is complete. Restart to run more Git commands."),
      ]);
      setCommand("");
      return;
    }

    const result = executeCommand(trimmedCommand, state);
    const nextHistory = [...history, inputLine, ...result.lines];
    const commandCount = getCommandCount(nextHistory);
    const puzzleSolved = puzzle.validate(result.newState, commandCount);

    setState(result.newState);
    setCommand("");

    if (!puzzleSolved) {
      setHistory(nextHistory);
      return;
    }

    setSolved(true);
    saveCompletedPuzzle(puzzle.id);
    setHistory([
      ...nextHistory,
      createTerminalLine("success", "Puzzle solved! Graph matches the target."),
    ]);
  }

  function renderGraph(graph: Graph) {
    if (graph.nodes.length === 0) {
      return (
        <div className="graph-scroll">
          <div className="empty-graph">No commits yet</div>
        </div>
      );
    }

    const nodeMap = new Map(graph.nodes.map((node) => [node.id, node]));
    const rowGap = 76;
    const colGap = 100;
    const leftPadding = 46;
    const topPadding = 46;
    const width = Math.max(460, leftPadding + graph.totalCols * colGap + 220);
    const height = Math.max(230, topPadding + graph.totalRows * rowGap + 90);

    function getX(col: number) {
      return leftPadding + col * colGap;
    }

    function getY(row: number) {
      return topPadding + row * rowGap;
    }

    return (
      <div className="graph-scroll">
        <svg
          className="gitgraph-canvas"
          width={width}
          height={height}
          role="img"
          aria-label="Git commit graph"
        >
          {graph.edges.map((edge) => {
            const fromNode = nodeMap.get(edge.fromId);
            const toNode = nodeMap.get(edge.toId);

            if (!fromNode || !toNode) {
              return null;
            }

            const fromX = getX(fromNode.col);
            const fromY = getY(fromNode.row);
            const toX = getX(toNode.col);
            const toY = getY(toNode.row);
            const isBranchLine = fromNode.col !== toNode.col;
            const stroke = isBranchLine || edge.isSecondParent ? "#0097b2" : "#1b0d47";

            if (isBranchLine) {
              const middleY = fromY + (toY - fromY) * 0.55;

              return (
                <path
                  key={`${edge.fromId}-${edge.toId}`}
                  d={`M ${fromX} ${fromY} C ${fromX} ${middleY}, ${toX} ${middleY}, ${toX} ${toY}`}
                  fill="none"
                  stroke={stroke}
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              );
            }

            return (
              <line
                key={`${edge.fromId}-${edge.toId}`}
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke={stroke}
                strokeWidth="6"
                strokeLinecap="round"
              />
            );
          })}

          {graph.nodes.map((node) => {
            const x = getX(node.col);
            const y = getY(node.row);
            const labelX = x + 42;
            const branchLabels = node.branches;
            const hasBranchLabels = branchLabels.length > 0;
            const branchStartY = node.isHead ? y - 10 : y - 12;

            return (
              <g key={node.id}>
                {node.isHead && (
                  <g>
                    <rect
                      x={labelX - 2}
                      y={y - 38}
                      width="54"
                      height="24"
                      rx="6"
                      fill="#16866a"
                      stroke="#1b0d47"
                      strokeWidth="2"
                    />
                    <text className="graph-head" x={labelX + 25} y={y - 22} textAnchor="middle">
                      HEAD
                    </text>
                  </g>
                )}

                {branchLabels.map((branchName, index) => {
                  const branchY = branchStartY + index * 28;
                  const isHeadBranch = node.isHead && index === 0;

                  return (
                    <g key={branchName}>
                    <rect
                      x={labelX - 2}
                      y={branchY}
                      width="54"
                      height="24"
                      rx="6"
                      fill="#fff"
                      stroke={isHeadBranch ? "#0097b2" : "#1b0d47"}
                      strokeWidth="2"
                    />
                    <text
                      className="graph-branch"
                      x={labelX + 25}
                      y={branchY + 16}
                      textAnchor="middle"
                    >
                      {branchName}
                    </text>
                  </g>
                  );
                })}

                <circle cx={x} cy={y} r="13" fill="#1b0d47" />

                <text className="graph-message" x={labelX + (hasBranchLabels ? 66 : 0)} y={y + 6}>
                  {node.message}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  return (
    <main className={`game-screen ${showInstructions ? "game-screen-instructions-open" : ""}`}>
      <div className={`game-play-area ${showInstructions ? "game-play-area-blurred" : ""}`}>
        <header className="game-topbar">
          <button
            className="game-back-btn"
            type="button"
            onClick={() => navigate("/puzzle")}
          >
            <span>←</span>
            Levels
          </button>

          <div className="game-title-group">
            <h1>
              {puzzle.id}. {puzzle.title}
            </h1>

            <span className="puzzle-level game-difficulty">
              {formatDifficulty(puzzle.difficulty)}
            </span>
          </div>

          <div className="game-actions">
            <button type="button" onClick={() => navigate("/documentation")}>
              Documentation Panel
            </button>

            <button type="button" onClick={showHowToPlay}>
              How To Play
            </button>

            <button type="button" onClick={reset}>
              Restart
            </button>

            {solved && (
              <button type="button" onClick={goToNextPuzzle}>
                {isLastPuzzle ? "All Done" : "Next Puzzle"}
              </button>
            )}
          </div>
        </header>

        {!user && (
          <p className="game-guest-warning">
            ⚠ Playing as guest - progress is saved in this browser only. <button type="button" onClick={() => navigate("/login")}>Login to back up your progress</button>
          </p>
        )}

        <section className="game-goal">
          <strong>Challenge:</strong> {puzzle.description}
        </section>

        <div className="game-layout">
          <div className="game-main">
            <div className="graphs-row">
              <section className="game-panel">
                <div className="game-panel-header">
                  <h2>Target Graph</h2>
                </div>

                {renderGraph(targetGraph)}
              </section>

              <section className={`game-panel ${solved ? "graph-card-solved" : ""}`}>
                <div className="game-panel-header">
                  <h2>Your Graph</h2>

                  {solved && <span className="graph-matched-label">Matched</span>}
                </div>

                {renderGraph(userGraph)}
              </section>
            </div>

            <section className="game-panel hint-panel">
              <strong>Hint:</strong> {puzzle.hints[0]}
            </section>

            <section className="terminal-window">
              <div className="terminal-titlebar">
                <span className="terminal-dot terminal-red"></span>
                <span className="terminal-dot terminal-yellow"></span>
                <span className="terminal-dot terminal-green"></span>

                <strong>GitBattle Terminal</strong>
              </div>

              <div className="terminal-body">
                {history.length === 0 && (
                  <p className="game-line-info">
                    Type git help to see every supported command. No git init, git add, or git push needed.
                  </p>
                )}

                {history.map((line) => (
                  <p className={`game-line-${line.type}`} key={line.id}>
                    {line.type === "input" ? `gitbattle (${branchName}) % ${line.text}` : line.text}
                  </p>
                ))}

                <form
                  className="terminal-input-line"
                  onSubmit={(event) => {
                    event.preventDefault();
                    runCommand();
                  }}
                >
                  <span>gitbattle ({branchName}) %</span>

                  <input
                    value={command}
                    onChange={(event) => setCommand(event.target.value)}
                    placeholder="enter git command"
                  />
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>

      {showInstructions && instruction && (
        <section className="game-instruction-overlay">
          <div className="game-instruction-card">
            <p className="game-instruction-count">
              {instructionStep + 1} / {gameInstructions.length}
            </p>

            <h2>{instruction.title}</h2>
            <p>{instruction.text}</p>

            <div className="game-instruction-actions">
              <button
                className="game-instruction-previous"
                type="button"
                disabled={instructionStep === 0}
                onClick={previousInstruction}
              >
                Previous
              </button>

              <button className="game-instruction-skip" type="button" onClick={skipInstructions}>
                Skip
              </button>

              <button type="button" onClick={nextInstruction}>
                {instructionStep === gameInstructions.length - 1 ? "Start Game" : "Next"}
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default Game;
