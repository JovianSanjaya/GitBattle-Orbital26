import gitCommit from "../assets/documentation/git commit.png";
import gitBranch from "../assets/documentation/git branch <branch name>.png";
import gitSwitch from "../assets/documentation/git switch <branch-name>.png";
import gitSwitchC from "../assets/documentation/git switch -c <branch-name>.png";
import gitMerge from "../assets/documentation/git merge <branch-name>.png";
import gitStatus from "../assets/documentation/git status.png";
import gitCommitAmend from "../assets/documentation/git commit —amend.png";
import gitBranchDelete from "../assets/documentation/git branch -d <branch name>.png";
import gitRebase from "../assets/documentation/git rebase <branch name>.png";
import gitResetHard from "../assets/documentation/git reset --hard HEAD~n.png";
import gitRevert from "../assets/documentation/git revert <commit>.png";
import gitTag from "../assets/documentation/git tag <name>.png";
import gitLogOneline from "../assets/documentation/git log --oneline.png";
import gitDescribe from "../assets/documentation/git describe.png";

export interface DocumentationItem {
  id: string;
  title: string;
  image: string;
  section: string;
  whatItDoes: string;
  graphChanges: string[];
}

export const documentationData: DocumentationItem[] = [
  {
    id: "git-commit",
    title: "git commit",
    section: "Saving Work",
    image: gitCommit,
    whatItDoes:
      "Records the staged work as a new commit in the repository. This creates a saved point in history that you can return to later.",
    graphChanges: [
      "A new commit appears after the current commit.",
      "The current branch moves forward to the new commit.",
      "HEAD follows the branch to the newest commit.",
      "Previous commits stay unchanged.",
    ],
  },
  {
    id: "git-branch",
    title: "git branch <branch-name>",
    section: "Branches",
    image: gitBranch,
    whatItDoes:
      "Creates a new branch name at your current commit. It does not change your files or move you to the new branch.",
    graphChanges: [
      "No new commit is added.",
      "A new branch label is placed on the current commit.",
      "HEAD stays on the current branch.",
      "The commit graph shape stays the same.",
    ],
  },
  {
    id: "git-switch",
    title: "git switch <branch-name>",
    section: "Checking out",
    image: gitSwitch,
    whatItDoes:
      "Moves your working position to another existing branch so you can continue work from that branch.",
    graphChanges: [
      "No commit is created.",
      "Branch labels stay in the same places.",
      "HEAD moves from the old branch to the selected branch.",
      "The graph structure does not change.",
    ],
  },
  {
    id: "git-switch-c",
    title: "git switch -c <branch-name>",
    section: "Checking out",
    image: gitSwitchC,
    whatItDoes:
      "Creates a new branch and immediately moves you onto it. It is a shortcut for creating a branch and switching to it.",
    graphChanges: [
      "No new commit is created.",
      "A new branch label is created at the current commit.",
      "HEAD moves onto the new branch.",
      "The old branch remains where it was.",
    ],
  },
  {
    id: "git-merge",
    title: "git merge <branch-name>",
    section: "Combining Work",
    image: gitMerge,
    whatItDoes:
      "Combines work from another branch into your current branch. This brings separate histories together.",
    graphChanges: [
      "A merge commit may be created.",
      "The current branch moves forward after the merge.",
      "HEAD follows the current branch.",
      "The merged branch label stays in its original position.",
    ],
  },
  {
    id: "git-status",
    title: "git status",
    section: "Inspecting",
    image: gitStatus,
    whatItDoes:
      "Checks the current state of your files. It tells you which files are changed, staged, or untracked.",
    graphChanges: [
      "No commit is created.",
      "HEAD does not move.",
      "No branch pointer changes.",
      "The graph stays exactly the same.",
    ],
  },
  {
    id: "git-commit-amend",
    title: "git commit --amend",
    section: "Saving Work",
    image: gitCommitAmend,
    whatItDoes: "Replaces the most recent commit with an updated version.",
    graphChanges: [
      "The old latest commit is replaced by a new commit.",
      "The branch pointer moves to the amended commit.",
      "HEAD follows the current branch.",
      "Earlier commits stay the same.",
    ],
  },
  {
    id: "git-branch-delete",
    title: "git branch -d <branch name>",
    section: "Branches",
    image: gitBranchDelete,
    whatItDoes: "Deletes a branch label that you no longer need.",
    graphChanges: [
      "No commits are deleted.",
      "The selected branch pointer is removed.",
      "HEAD stays where it is.",
      "The commit graph shape does not change.",
    ],
  },
  {
    id: "git-rebase",
    title: "git rebase <branch name>",
    section: "Combining Work",
    image: gitRebase,
    whatItDoes: "Moves your current branch so it starts from another branch’s latest commit.",
    graphChanges: [
      "Your commits are replayed onto a new base commit.",
      "New rewritten commits may be created.",
      "The current branch pointer moves to the rewritten history.",
      "The original commits are no longer used by that branch.",
    ],
  },
  {
    id: "git-reset-hard",
    title: "git reset --hard HEAD~n",
    section: "Undoing",
    image: gitResetHard,
    whatItDoes: "Moves the current branch backward and discards matching working directory changes.",
    graphChanges: [
      "The branch pointer moves back by n commits.",
      "HEAD follows the branch backward.",
      "Later commits may become unreachable from the branch.",
      "Your working tree is reset to the chosen commit.",
    ],
  },
  {
    id: "git-revert",
    title: "git revert <commit>",
    section: "Undoing",
    image: gitRevert,
    whatItDoes: "Creates a new commit that undoes the changes from an earlier commit.",
    graphChanges: [
      "A new commit is added.",
      "The current branch moves forward.",
      "HEAD follows the branch.",
      "Old commits stay in history.",
    ],
  },
  {
    id: "git-tag",
    title: "git tag <name>",
    section: "Tags",
    image: gitTag,
    whatItDoes: "Adds a named label to a specific commit, often used for versions or releases.",
    graphChanges: [
      "No new commit is created.",
      "A tag label is added to a commit.",
      "HEAD does not move.",
      "Branch pointers stay where they are.",
    ],
  },
  {
    id: "git-log-oneline",
    title: "git log --oneline",
    section: "Inspecting",
    image: gitLogOneline,
    whatItDoes: "Shows the commit history in a compact one-line format.",
    graphChanges: [
      "No commit is created.",
      "No branch pointer moves.",
      "HEAD does not move.",
      "The graph is only being inspected.",
    ],
  },
  {
    id: "git-describe",
    title: "git describe",
    section: "Tags",
    image: gitDescribe,
    whatItDoes: "Gives a human-readable name for the current commit based on the nearest tag.",
    graphChanges: [
      "No commit is created.",
      "No branch or tag moves.",
      "HEAD stays in place.",
      "The command only describes the current position.",
    ],
  },
];