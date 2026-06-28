import type { GitState } from "../../types/git";
import {
  makeCommit,
  getFirstParentArray,
  isAncestor,
} from "../lib/commands/helpers";

export type Difficulty = "easy" | "intermediate" | "advanced";

export interface Puzzle {
  id: number;
  title: string;
  tagline: string;
  description: string;
  difficulty: Difficulty;
  initialState: GitState;
  targetState: GitState;
  validate: (state: GitState, commandCount: number) => boolean;
  hints: string[];
  docsHighlight: string[];
}

const C1 = makeCommit("Initial commit", [], "seed-c1");

const C2 = makeCommit("Add README", [C1.id], "seed-c2");

const C3 = makeCommit("Add homepage", [C2.id], "seed-c3");

const C4 = makeCommit("Add experiment", [C3.id], "seed-c4");

const B1 = makeCommit("Initial commit", [], "seed-b1");

const B2 = makeCommit("Add homepage", [B1.id], "seed-b2");

const B3 = makeCommit("Style navbar", [B2.id], "seed-b3");

const B4 = makeCommit("Fix typo", [B2.id], "seed-b4");

const R1 = makeCommit("Initial commit", [], "seed-r1");

const R2 = makeCommit("Add login page", [R1.id], "seed-r2");

const R3 = makeCommit("Add dashboard", [R2.id], "seed-r3");

const R4 = makeCommit("Buggy feature", [R3.id], "seed-r4");

const R5 = makeCommit("Another bad commit", [R4.id], "seed-r5");

const S1 = makeCommit("Initial commit", [], "seed-s1");

const S2 = makeCommit("Setup project", [S1.id], "seed-s2");

const S3 = makeCommit("Add auth", [S2.id], "seed-s3");

const S4 = makeCommit("Add profile", [S3.id], "seed-s4");

const S5 = makeCommit("Add settings", [S2.id], "seed-s5");

const T1 = makeCommit("Initial commit", [], "seed-t1");

const T2 = makeCommit("Add API", [T1.id], "seed-t2");

const T3 = makeCommit("Add tests", [T2.id], "seed-t3");

const T4 = makeCommit("Refactor API", [T2.id], "seed-t4");

const T5 = makeCommit("Update tests", [T4.id], "seed-t5");

function branchTip(state: GitState, branch: string) {
  const tip = state.branches[branch];

  return tip && state.commits[tip] ? tip : null;
}

function isOnBranch(state: GitState, branch: string) {
  return state.head.type === "branch" && state.head.name === branch;
}

function chainMessages(state: GitState, branch: string) {
  const tip = branchTip(state, branch);

  if (!tip) return [];

  return getFirstParentArray(state, tip)
    .map((id) => state.commits[id]?.message)
    .filter(Boolean)
    .reverse();
}

function hasExactChain(state: GitState, branch: string, messages: string[]) {
  const actual = chainMessages(state, branch);

  return (
    actual.length === messages.length &&
    actual.every((message, index) => message === messages[index])
  );
}

export const PUZZLES: Puzzle[] = [
  // Easy Puzzles

  {
    id: 1,

    title: "Two Commits",

    tagline: "Build a short main history",

    description:
      "main only has the first commit. Add two new commits so the graph shows README first, then homepage.",

    difficulty: "easy",

    initialState: {
      commits: { [C1.id]: C1 },
      branches: { main: C1.id },
      head: { type: "branch", name: "main" },
    },

    targetState: {
      commits: { [C1.id]: C1, [C2.id]: C2, [C3.id]: C3 },
      branches: { main: C3.id },
      head: { type: "branch", name: "main" },
    },

    validate(state) {
      return (
        isOnBranch(state, "main") &&
        hasExactChain(state, "main", [
          "Initial commit",
          "Add README",
          "Add homepage",
        ])
      );
    },

    hints: [
      "You need two new snapshots on main, in the same order as the target messages.",
      "Each new snapshot adds one dot after the current main tip.",
    ],

    docsHighlight: ["git commit"],
  },

  {
    id: 2,

    title: "Create And Switch",

    tagline: "Make a branch and stand on it",

    description:
      "Create a branch called feature and switch to it. The new branch should point to the same commit as main.",

    difficulty: "easy",

    initialState: {
      commits: { [C1.id]: C1, [C2.id]: C2 },
      branches: { main: C2.id },
      head: { type: "branch", name: "main" },
    },

    targetState: {
      commits: { [C1.id]: C1, [C2.id]: C2 },
      branches: { main: C2.id, feature: C2.id },
      head: { type: "branch", name: "feature" },
    },

    validate(state) {
      return (
        isOnBranch(state, "feature") &&
        state.branches.feature === state.branches.main
      );
    },

    hints: [
      "Look for the command that creates a branch and moves HEAD to it at the same time.",
      "The graph shape should not grow; only the labels should change.",
    ],

    docsHighlight: ["git checkout"],
  },

  {
    id: 3,

    title: "Feature Commit",

    tagline: "Work on a side branch, then return",

    description:
      "Create feature, commit the navbar work there, then switch back to main. main should stay behind feature.",

    difficulty: "easy",

    initialState: {
      commits: { [B1.id]: B1, [B2.id]: B2 },
      branches: { main: B2.id },
      head: { type: "branch", name: "main" },
    },

    targetState: {
      commits: { [B1.id]: B1, [B2.id]: B2, [B3.id]: B3 },
      branches: { main: B2.id, feature: B3.id },
      head: { type: "branch", name: "main" },
    },

    validate(state) {
      const mainTip = branchTip(state, "main");
      const featureTip = branchTip(state, "feature");

      return (
        isOnBranch(state, "main") &&
        !!mainTip &&
        !!featureTip &&
        mainTip !== featureTip &&
        state.commits[featureTip]?.message === "Style navbar" &&
        isAncestor(state.commits, mainTip, featureTip)
      );
    },

    hints: [
      "The new commit must happen while HEAD is on feature, not on main.",
      "After the feature work exists, HEAD should return to main.",
    ],

    docsHighlight: ["git checkout", "git commit"],
  },

  // Intermediate Puzzles

  {
    id: 4,

    title: "Merge And Delete",

    tagline: "Fast-forward, then clean the branch list",

    description:
      "You are on feature, but the work belongs on main. Switch back to main, merge feature, then delete feature.",

    difficulty: "intermediate",

    initialState: {
      commits: { [B1.id]: B1, [B2.id]: B2, [B3.id]: B3 },
      branches: { main: B2.id, feature: B3.id },
      head: { type: "branch", name: "feature" },
    },

    targetState: {
      commits: { [B1.id]: B1, [B2.id]: B2, [B3.id]: B3 },
      branches: { main: B3.id },
      head: { type: "branch", name: "main" },
    },

    validate(state, commandCount) {
      return (
        commandCount >= 3 &&
        isOnBranch(state, "main") &&
        state.branches.main === B3.id &&
        state.branches.feature === undefined
      );
    },

    hints: [
      "HEAD starts on the wrong branch, so move it before bringing the work across.",
      "After main catches up, remove the extra branch label.",
    ],

    docsHighlight: ["git merge", "git branch"],
  },

  {
    id: 5,

    title: "Reset And Clean",

    tagline: "Remove a branch label, then undo mistakes",

    description:
      "You are on an experiment branch at two mistaken commits. Return to main, delete experiment, then reset main back to Add README.",

    difficulty: "intermediate",

    initialState: {
      commits: { [C1.id]: C1, [C2.id]: C2, [C3.id]: C3, [C4.id]: C4 },
      branches: { main: C4.id, experiment: C4.id },
      head: { type: "branch", name: "experiment" },
    },

    targetState: {
      commits: { [C1.id]: C1, [C2.id]: C2, [C3.id]: C3, [C4.id]: C4 },
      branches: { main: C2.id },
      head: { type: "branch", name: "main" },
    },

    validate(state, commandCount) {
      return (
        commandCount >= 3 &&
        isOnBranch(state, "main") &&
        state.branches.experiment === undefined &&
        hasExactChain(state, "main", ["Initial commit", "Add README"])
      );
    },

    hints: [
      "You cannot delete the branch HEAD is currently attached to.",
      "After the extra branch label is gone, move main back by the number of unwanted commits.",
    ],

    docsHighlight: ["git checkout", "git branch", "git reset"],
  },

  {
    id: 6,

    title: "True Merge Cleanup",

    tagline: "Join two histories, then clean the branch list",

    description:
      "You are on feature, but main and feature both changed after Add homepage. Switch to main, merge feature, then delete feature.",

    difficulty: "intermediate",

    initialState: {
      commits: { [B1.id]: B1, [B2.id]: B2, [B3.id]: B3, [B4.id]: B4 },
      branches: { main: B4.id, feature: B3.id },
      head: { type: "branch", name: "feature" },
    },

    targetState: (() => {
      const mergeCommit = makeCommit(
        "Merge branch 'feature'",
        [B4.id, B3.id],
        "seed-merge",
      );

      return {
        commits: {
          [B1.id]: B1,
          [B2.id]: B2,
          [B3.id]: B3,
          [B4.id]: B4,
          [mergeCommit.id]: mergeCommit,
        },
        branches: { main: mergeCommit.id },
        head: { type: "branch", name: "main" },
      };
    })(),

    validate(state, commandCount) {
      const mainTip = branchTip(state, "main");
      const featureDeleted = state.branches.feature === undefined;

      return (
        commandCount >= 3 &&
        isOnBranch(state, "main") &&
        !!mainTip &&
        featureDeleted &&
        state.commits[mainTip]?.parentIds.length === 2 &&
        isAncestor(state.commits, B3.id, mainTip) &&
        isAncestor(state.commits, B4.id, mainTip)
      );
    },

    hints: [
      "HEAD starts on feature, but the final merge commit belongs on main.",
      "The final graph should keep the merge commit and remove the old feature label.",
    ],

    docsHighlight: ["git checkout", "git merge", "git branch"],
  },

  // Advanced Puzzles

  {
    id: 7,

    title: "Revert The Bad Commits",

    tagline: "Undo mistakes safely without rewriting history",

    description:
      "Two bad commits were pushed to main. Use git revert to undo them — but without deleting them from history. The graph should grow, not shrink.",

    difficulty: "advanced",

    initialState: {
      commits: {
        [R1.id]: R1,
        [R2.id]: R2,
        [R3.id]: R3,
        [R4.id]: R4,
        [R5.id]: R5,
      },
      branches: { main: R5.id },
      head: { type: "branch", name: "main" },
    },

    targetState: (() => {
      const undo5 = makeCommit(
        'Revert "Another bad commit"',
        [R5.id],
        "seed-r-undo5",
      );
      const undo4 = makeCommit(
        'Revert "Buggy feature"',
        [undo5.id],
        "seed-r-undo4",
      );

      return {
        commits: {
          [R1.id]: R1,
          [R2.id]: R2,
          [R3.id]: R3,
          [R4.id]: R4,
          [R5.id]: R5,
          [undo5.id]: undo5,
          [undo4.id]: undo4,
        },
        branches: { main: undo4.id },
        head: { type: "branch", name: "main" },
      };
    })(),

    validate(state) {
      const tip = branchTip(state, "main");

      if (!tip) return false;

      const chain = getFirstParentArray(state, tip);

      if (chain.length < 7) return false;

      const [newest, secondNewest] = chain;
      const newestMsg = state.commits[newest]?.message ?? "";
      const secondMsg = state.commits[secondNewest]?.message ?? "";

      return (
        isOnBranch(state, "main") &&
        newestMsg.startsWith("Revert") &&
        secondMsg.startsWith("Revert")
      );
    },

    hints: [
      "git revert adds a NEW commit that cancels a previous one — history is never deleted.",
      "Revert the most recent bad commit first (HEAD), then the one before it (HEAD~1).",
    ],

    docsHighlight: ["git revert"],
  },

  {
    id: 8,

    title: "Rebase Onto Main",

    tagline: "Replay your feature on top of the latest main",

    description:
      "The feature branch forked from an old version of main. Use git rebase to move it on top of the current main tip so the history becomes a clean straight line.",

    difficulty: "advanced",

    initialState: {
      commits: {
        [S1.id]: S1,
        [S2.id]: S2,
        [S3.id]: S3,
        [S4.id]: S4,
        [S5.id]: S5,
      },
      branches: { main: S5.id, feature: S4.id },
      head: { type: "branch", name: "feature" },
    },

    targetState: (() => {
      const RS3 = makeCommit("Add auth", [S5.id], "seed-rs3");
      const RS4 = makeCommit("Add profile", [RS3.id], "seed-rs4");

      return {
        commits: {
          [S1.id]: S1,
          [S2.id]: S2,
          [S3.id]: S3,
          [S4.id]: S4,
          [S5.id]: S5,
          [RS3.id]: RS3,
          [RS4.id]: RS4,
        },
        branches: { main: S5.id, feature: RS4.id },
        head: { type: "branch", name: "feature" },
      };
    })(),

    validate(state) {
      const featureTip = branchTip(state, "feature");
      const mainTip = branchTip(state, "main");

      if (!featureTip || !mainTip) return false;

      if (!isAncestor(state.commits, mainTip, featureTip)) return false;

      const messages = chainMessages(state, "feature");
      const last2 = messages.slice(-2);

      return (
        isOnBranch(state, "feature") &&
        last2[0] === "Add auth" &&
        last2[1] === "Add profile"
      );
    },

    hints: [
      "Switch to the feature branch first, then run git rebase main.",
      "After rebasing, the feature commits appear after main's latest commit — a clean straight line.",
    ],

    docsHighlight: ["git rebase"],
  },

  {
    id: 9,

    title: "Tag The Release",

    tagline: "Mark an important commit with a permanent label",

    description:
      "The team is shipping v1.0. Create a tag called v1.0 on the Add tests commit, then create a hotfix branch at that same tag.",

    difficulty: "advanced",

    initialState: {
      commits: {
        [T1.id]: T1,
        [T2.id]: T2,
        [T3.id]: T3,
        [T4.id]: T4,
        [T5.id]: T5,
      },
      branches: { main: T3.id, refactor: T5.id },
      head: { type: "branch", name: "main" },
    },

    targetState: {
      commits: {
        [T1.id]: T1,
        [T2.id]: T2,
        [T3.id]: T3,
        [T4.id]: T4,
        [T5.id]: T5,
      },
      branches: { main: T3.id, refactor: T5.id, hotfix: T3.id },
      head: { type: "branch", name: "main" },
      tags: { "v1.0": T3.id },
    },

    validate(state) {
      const tags = state.tags ?? {};

      return (
        isOnBranch(state, "main") &&
        tags["v1.0"] === T3.id &&
        state.branches.hotfix === T3.id
      );
    },

    hints: [
      "Use git tag v1.0 to tag HEAD (which is already on the Add tests commit).",
      "Then create the hotfix branch with git branch hotfix — it will point at HEAD.",
    ],

    docsHighlight: ["git tag", "git branch"],
  },
];
