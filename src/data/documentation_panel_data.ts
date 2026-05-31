import gitCommit from "../assets/documentation/git commit.png";
import gitBranch from "../assets/documentation/git branch <branch name>.png";
import gitSwitch from "../assets/documentation/git switch <branch-name>.png";
import gitSwitchC from "../assets/documentation/git switch -c <branch-name>.png";
import gitMerge from "../assets/documentation/git merge <branch-name>.png";
import gitStatus from "../assets/documentation/git status.png";

const documentationData = [
  {
    id: "git-commit",
    title: "git commit",
    image: gitCommit,
  },
  {
    id: "git-branch",
    title: "git branch <branch-name>",
    image: gitBranch,
  },
  {
    id: "git-switch",
    title: "git switch <branch-name>",
    image: gitSwitch,
  },
  {
    id: "git-switch-c",
    title: "git switch -c <branch-name>",
    image: gitSwitchC,
  },
  {
    id: "git-merge",
    title: "git merge <branch-name>",
    image: gitMerge,
  },
  {
    id: "git-status",
    title: "git status",
    image: gitStatus,
  },
];

export {documentationData}