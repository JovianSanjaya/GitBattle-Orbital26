import { describe, expect, it } from "vitest";
import { PUZZLES } from "../data/puzzles";
import type { GitState, Terminal } from "../../types/git";
import { executeCommand } from "./git-engine";
import { computeLayout } from "./graph-layout";


function runCommand(state: GitState, command: string) {
  return executeCommand(command, state);
}


function runCommands(startState: GitState, commands: string[]) {
  let state = startState;
  const history: Terminal[] = [];

  for (const command of commands) {
    const result = runCommand(state, command);

    state = result.newState;
    history.push({ id: command, type: "input", text: command });
    history.push(...result.lines);
  }

  return {
    state,
    history,
    commandCount: commands.length,
  };
}


function getBranchMessage(state: GitState, branchName: string) {
  const commitId = state.branches[branchName];

  if (!commitId) {
    return "";
  }

  return state.commits[commitId]?.message ?? "";
}


describe("GitBattle Git engine", () => {
  it("shows an error when the player types a non-git command", () => {
    const puzzle = PUZZLES[0];

    const result = runCommand(puzzle.initialState, "gs");

    expect(result.newState).toBe(puzzle.initialState);
    expect(result.lines[0].type).toBe("error");
    expect(result.lines[0].text).toContain("commands start with 'git'");
  });


  it("creates commits and solves the first puzzle", () => {
    const puzzle = PUZZLES[0];

    const result = runCommands(puzzle.initialState, [
      'git commit -m "Add README"',
      'git commit -m "Add homepage"',
    ]);

    expect(getBranchMessage(result.state, "main")).toBe("Add homepage");
    expect(puzzle.validate(result.state, result.commandCount)).toBe(true);
  });


  it("creates and checks out a feature branch without git switch", () => {
    const puzzle = PUZZLES[1];

    const result = runCommands(puzzle.initialState, [
      "git checkout -b feature",
    ]);

    expect(result.state.head).toEqual({ type: "branch", name: "feature" });
    expect(result.state.branches.feature).toBe(result.state.branches.main);
    expect(puzzle.validate(result.state, result.commandCount)).toBe(true);
  });


  it("keeps main behind after making a commit on feature", () => {
    const puzzle = PUZZLES[2];

    const result = runCommands(puzzle.initialState, [
      "git checkout -b feature",
      'git commit -m "Style navbar"',
      "git checkout main",
    ]);

    expect(result.state.head).toEqual({ type: "branch", name: "main" });
    expect(getBranchMessage(result.state, "main")).toBe("Add homepage");
    expect(getBranchMessage(result.state, "feature")).toBe("Style navbar");
    expect(puzzle.validate(result.state, result.commandCount)).toBe(true);
  });


  it("fast-forwards main and deletes the feature branch", () => {
    const puzzle = PUZZLES[3];

    const result = runCommands(puzzle.initialState, [
      "git checkout main",
      "git merge feature",
      "git branch -d feature",
    ]);

    expect(result.state.head).toEqual({ type: "branch", name: "main" });
    expect(result.state.branches.feature).toBeUndefined();
    expect(getBranchMessage(result.state, "main")).toBe("Style navbar");
    expect(puzzle.validate(result.state, result.commandCount)).toBe(true);
  });


  it("resets main back to Add README after deleting experiment", () => {
    const puzzle = PUZZLES[4];

    const result = runCommands(puzzle.initialState, [
      "git checkout main",
      "git branch -d experiment",
      "git reset --hard HEAD~2",
    ]);

    expect(result.state.head).toEqual({ type: "branch", name: "main" });
    expect(result.state.branches.experiment).toBeUndefined();
    expect(getBranchMessage(result.state, "main")).toBe("Add README");
    expect(puzzle.validate(result.state, result.commandCount)).toBe(true);
  });


  it("creates a true merge commit with two parents", () => {
    const puzzle = PUZZLES[5];

    const result = runCommands(puzzle.initialState, [
      "git checkout main",
      "git merge feature",
      "git branch -d feature",
    ]);

    const mainTip = result.state.branches.main;
    const mainCommit = result.state.commits[mainTip];

    expect(result.state.branches.feature).toBeUndefined();
    expect(mainCommit.message).toBe("Merge branch 'feature'");
    expect(mainCommit.parentIds).toHaveLength(2);
    expect(puzzle.validate(result.state, result.commandCount)).toBe(true);
  });


  it("creates a tag on the current commit", () => {
    const puzzle = PUZZLES[8];

    const result = runCommand(puzzle.initialState, "git tag v10");

    expect(result.newState.tags?.v10).toBe(puzzle.initialState.branches.main);
    expect(result.lines[0].type).toBe("success");
  });


  it("rebases feature commits on top of main", () => {
    const puzzle = PUZZLES[7];

    const result = runCommands(puzzle.initialState, [
      "git rebase main",
    ]);

    expect(result.state.head).toEqual({ type: "branch", name: "feature" });
    expect(puzzle.validate(result.state, result.commandCount)).toBe(true);
  });


  it("builds graph layout data for target and player graphs", () => {
    const puzzle = PUZZLES[2];
    const targetGraph = computeLayout(puzzle.targetState);
    const playerGraph = computeLayout(puzzle.initialState);

    expect(targetGraph.nodes.length).toBeGreaterThan(playerGraph.nodes.length);
    expect(targetGraph.edges.length).toBeGreaterThan(playerGraph.edges.length);
    expect(targetGraph.nodes.some((node) => node.branches.includes("feature"))).toBe(true);
  });
});
