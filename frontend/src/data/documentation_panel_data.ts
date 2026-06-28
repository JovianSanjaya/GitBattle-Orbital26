import { gitHelpData } from "../game/lib/data/git-help-data";


type DocumentationItem = {
  id: string;
  title: string;
  command: string;
  description: string;
};

type DocumentationSection = {
  title: string;
  items: DocumentationItem[];
};


const documentationDetails: Record<string, { description: string }> = {
  'git commit -m "message"': {
    description: "Creates a new commit on the current branch using the message you provide.",
  },

  'git commit --amend -m "new message"': {
    description: "Replaces the latest commit message on the current branch.",
  },

  "git branch": {
    description: "Shows all branches and marks the branch that HEAD is currently on.",
  },

  "git branch <name>": {
    description: "Creates a new branch at the current commit without moving HEAD.",
  },

  "git branch -d <name>": {
    description: "Deletes a branch label if it is safe to remove.",
  },

  "git checkout <branch>": {
    description: "Moves HEAD to an existing branch.",
  },

  "git checkout -b <branch>": {
    description: "Creates a new branch and moves HEAD to it.",
  },

  "git checkout -": {
    description: "Moves HEAD back to the previous branch or previous detached commit.",
  },

  "git checkout <commit>": {
    description: "Moves HEAD directly to a commit and enters detached HEAD mode.",
  },

  "git merge <branch>": {
    description: "Combines another branch into the current branch.",
  },

  "git rebase <branch>": {
    description: "Replays the current branch commits on top of another branch.",
  },

  "git reset --hard HEAD~n": {
    description: "Moves the current branch backward by n commits.",
  },

  "git revert <commit>": {
    description: "Creates a new commit that undoes an older commit without deleting history.",
  },

  "git tag": {
    description: "Shows all tag labels.",
  },

  "git tag <name>": {
    description: "Creates a tag label on the current commit.",
  },

  "git status": {
    description: "Shows the current branch and basic repository state.",
  },

  "git log --oneline <ref>": {
    description: "Shows commit history from HEAD or from a reference.",
  },

  "git describe <ref>": {
    description: "Describes a commit using a reachable tag.",
  },
};


function makeId(command: string) {
  return command
    .toLowerCase()
    .replace(/["<>]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}


function getCommandsFromHelpData() {
  const sections: Array<{ title: string; commands: string[] }> = [];
  let currentSection: { title: string; commands: string[] } | null = null;


  for (const [, rawText] of gitHelpData) {
    const text = rawText.trim();

    if (text.includes("──")) {
      currentSection = {
        title: cleanSectionTitle(text),
        commands: [],
      };

      sections.push(currentSection);
    }

    if (text.startsWith("git ")) {
      currentSection?.commands.push(text);
    }
  }


  return sections;
}


function cleanSectionTitle(text: string) {
  const title = text
    .replace(/[─]/g, "")
    .trim();

  if (title === "Switching branches") {
    return "Switching";
  }

  if (title === "Combining work") {
    return "Combining Work";
  }

  if (title === "Undoing work") {
    return "Undoing";
  }

  if (title === "Saving work") {
    return "Saving Work";
  }

  return title;
}


function makeDocumentationItem(command: string): DocumentationItem {
  const details = documentationDetails[command];

  return {
    id: makeId(command),
    title: command,
    command,
    description: details?.description ?? "This command is supported in the GitBattle terminal.",
  };
}


const documentationSections: DocumentationSection[] = getCommandsFromHelpData().map((section) => {
  return {
    title: section.title,
    items: section.commands.map((command) => makeDocumentationItem(command)),
  };
});


const documentationData: DocumentationItem[] = documentationSections.flatMap((section) => section.items);


export { documentationData, documentationSections };

export type { DocumentationItem, DocumentationSection };
