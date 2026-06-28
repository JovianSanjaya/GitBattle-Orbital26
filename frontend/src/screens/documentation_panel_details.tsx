import { useParams } from "react-router-dom";
import BackBtn from "../components/back-btn";
import { documentationData } from "../data/documentation_panel_data";


type GraphLabel = {
  text: string;
  type?: "head" | "branch" | "tag" | "detached";
};


type GraphNode = {
  name: string;
  message: string;
  labels?: GraphLabel[];
  tone?: "normal" | "new" | "muted";
};


type GraphExample = {
  beforeTitle: string;
  afterTitle: string;
  beforeNodes: GraphNode[];
  afterNodes: GraphNode[];
};


type CommandLesson = {
  whatItDoes: string;
  graphChanges: string[];
  graphExample: GraphExample;
};


const mainHead = [
  { text: "main", type: "branch" as const },
  { text: "HEAD", type: "head" as const },
];


const featureHead = [
  { text: "feature", type: "branch" as const },
  { text: "HEAD", type: "head" as const },
];


const sameGraph: GraphExample = {
  beforeTitle: "Before",
  afterTitle: "After",
  beforeNodes: [
    {
      name: "C1",
      message: "Initial commit",
      labels: mainHead,
    },
  ],
  afterNodes: [
    {
      name: "C1",
      message: "Initial commit",
      labels: mainHead,
    },
  ],
};


function getCommandLesson(command: string, description: string): CommandLesson {
  const lessons: Record<string, CommandLesson> = {
    'git commit -m "message"': {
      whatItDoes: "Saves your current work as a new commit. In GitBattle, this creates a new node in Your Graph.",
      graphChanges: [
        "A new commit node is added after the current commit.",
        "The current branch moves forward to the new commit.",
        "HEAD follows the current branch.",
      ],
      graphExample: {
        beforeTitle: "Before commit",
        afterTitle: "After commit",
        beforeNodes: [
          {
            name: "C1",
            message: "Initial commit",
            labels: mainHead,
          },
        ],
        afterNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "message",
            tone: "new",
            labels: mainHead,
          },
        ],
      },
    },

    'git commit --amend -m "new message"': {
      whatItDoes: "Changes the latest commit instead of adding another commit after it.",
      graphChanges: [
        "The latest commit is replaced with a new version.",
        "The branch still points to the latest commit.",
        "The graph length usually stays the same.",
      ],
      graphExample: {
        beforeTitle: "Before amend",
        afterTitle: "After amend",
        beforeNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "old message",
            labels: mainHead,
          },
        ],
        afterNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2'",
            message: "new message",
            tone: "new",
            labels: mainHead,
          },
        ],
      },
    },

    "git branch": {
      whatItDoes: "Lists the branch labels that exist in the repository.",
      graphChanges: [
        "No commit node is created.",
        "No branch pointer moves.",
        "It only prints information in the terminal.",
      ],
      graphExample: sameGraph,
    },

    "git branch <name>": {
      whatItDoes: "Adds a new branch label to the commit you are currently standing on.",
      graphChanges: [
        "A new branch label appears on the current commit.",
        "HEAD stays on the current branch.",
        "No new commit is created.",
      ],
      graphExample: {
        beforeTitle: "Before branch",
        afterTitle: "After branch",
        beforeNodes: [
          {
            name: "C1",
            message: "Initial commit",
            labels: mainHead,
          },
        ],
        afterNodes: [
          {
            name: "C1",
            message: "Initial commit",
            labels: [
              { text: "main", type: "branch" },
              { text: "feature", type: "branch" },
              { text: "HEAD", type: "head" },
            ],
          },
        ],
      },
    },

    "git branch -d <name>": {
      whatItDoes: "Removes a branch label from the graph. The commits are not automatically deleted.",
      graphChanges: [
        "The selected branch label disappears.",
        "The commit nodes stay in the graph if they are still reachable.",
        "HEAD does not move unless you try to delete the current branch, which GitBattle blocks.",
      ],
      graphExample: {
        beforeTitle: "Before delete",
        afterTitle: "After delete",
        beforeNodes: [
          {
            name: "C1",
            message: "Initial commit",
            labels: [
              { text: "main", type: "branch" },
              { text: "feature", type: "branch" },
              { text: "HEAD", type: "head" },
            ],
          },
        ],
        afterNodes: [
          {
            name: "C1",
            message: "Initial commit",
            labels: mainHead,
          },
        ],
      },
    },

    "git checkout <branch>": {
      whatItDoes: "Changes which branch you are standing on.",
      graphChanges: [
        "HEAD moves to the selected branch label.",
        "The branch commit positions do not change.",
        "Future commits will be created on the branch you checked out.",
      ],
      graphExample: {
        beforeTitle: "Before checkout",
        afterTitle: "After checkout",
        beforeNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "main work",
            labels: mainHead,
          },
          {
            name: "C3",
            message: "feature work",
            labels: [
              { text: "feature", type: "branch" },
            ],
          },
        ],
        afterNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "main work",
            labels: [
              { text: "main", type: "branch" },
            ],
          },
          {
            name: "C3",
            message: "feature work",
            labels: featureHead,
          },
        ],
      },
    },

    "git checkout -b <branch>": {
      whatItDoes: "Creates a branch label and immediately stands on that new branch.",
      graphChanges: [
        "A new branch label appears on the current commit.",
        "HEAD moves to the new branch.",
        "No new commit is created yet.",
      ],
      graphExample: {
        beforeTitle: "Before checkout -b",
        afterTitle: "After checkout -b",
        beforeNodes: [
          {
            name: "C1",
            message: "Initial commit",
            labels: mainHead,
          },
        ],
        afterNodes: [
          {
            name: "C1",
            message: "Initial commit",
            labels: [
              { text: "main", type: "branch" },
              { text: "feature", type: "branch" },
              { text: "HEAD", type: "head" },
            ],
          },
        ],
      },
    },

    "git checkout -": {
      whatItDoes: "Jumps back to where you were before the latest checkout.",
      graphChanges: [
        "HEAD moves back to the previous place.",
        "No commit node is created.",
        "Branch pointers do not move.",
      ],
      graphExample: {
        beforeTitle: "Before checkout -",
        afterTitle: "After checkout -",
        beforeNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "main work",
            labels: [
              { text: "main", type: "branch" },
            ],
          },
          {
            name: "C3",
            message: "feature work",
            labels: featureHead,
          },
        ],
        afterNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "main work",
            labels: mainHead,
          },
          {
            name: "C3",
            message: "feature work",
            labels: [
              { text: "feature", type: "branch" },
            ],
          },
        ],
      },
    },

    "git checkout <commit>": {
      whatItDoes: "Lets you stand on a commit directly instead of standing on a branch.",
      graphChanges: [
        "HEAD moves to the chosen commit.",
        "The branch labels stay where they were.",
        "This creates a detached HEAD state.",
      ],
      graphExample: {
        beforeTitle: "Before detached checkout",
        afterTitle: "After detached checkout",
        beforeNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "latest work",
            labels: mainHead,
          },
        ],
        afterNodes: [
          {
            name: "C1",
            message: "Initial commit",
            labels: [
              { text: "HEAD", type: "detached" },
            ],
          },
          {
            name: "C2",
            message: "latest work",
            labels: [
              { text: "main", type: "branch" },
            ],
          },
        ],
      },
    },

    "git merge <branch>": {
      whatItDoes: "Brings work from another branch into the branch you are currently on.",
      graphChanges: [
        "The current branch moves forward to include the other branch.",
        "If the histories split, a merge commit can join both sides.",
        "HEAD stays on the current branch after the merge.",
      ],
      graphExample: {
        beforeTitle: "Before merge",
        afterTitle: "After merge",
        beforeNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "main work",
            labels: mainHead,
          },
          {
            name: "F1",
            message: "feature work",
            labels: [
              { text: "feature", type: "branch" },
            ],
          },
        ],
        afterNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "main work",
          },
          {
            name: "M1",
            message: "merge feature",
            tone: "new",
            labels: mainHead,
          },
        ],
      },
    },

    "git rebase <branch>": {
      whatItDoes: "Moves your branch work so it starts from the latest commit of another branch.",
      graphChanges: [
        "The current branch commits are copied into new commits.",
        "The current branch points to the copied commits.",
        "The graph becomes more linear.",
      ],
      graphExample: {
        beforeTitle: "Before rebase",
        afterTitle: "After rebase",
        beforeNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "main work",
            labels: [
              { text: "main", type: "branch" },
            ],
          },
          {
            name: "F1",
            message: "feature work",
            labels: featureHead,
          },
        ],
        afterNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "main work",
            labels: [
              { text: "main", type: "branch" },
            ],
          },
          {
            name: "F1'",
            message: "feature work",
            tone: "new",
            labels: featureHead,
          },
        ],
      },
    },

    "git reset --hard HEAD~n": {
      whatItDoes: "Moves the current branch pointer back to an earlier commit.",
      graphChanges: [
        "The current branch moves backward.",
        "HEAD follows the branch backward.",
        "Commits after the branch pointer are no longer part of that branch history.",
      ],
      graphExample: {
        beforeTitle: "Before reset",
        afterTitle: "After reset",
        beforeNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "Add README",
          },
          {
            name: "C3",
            message: "Add homepage",
            labels: mainHead,
          },
        ],
        afterNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "Add README",
            labels: mainHead,
          },
          {
            name: "C3",
            message: "Add homepage",
            tone: "muted",
          },
        ],
      },
    },

    "git revert <commit>": {
      whatItDoes: "Safely undoes a commit by adding another commit after it.",
      graphChanges: [
        "The old commit stays in history.",
        "A new revert commit is added at the end.",
        "The current branch moves forward to the revert commit.",
      ],
      graphExample: {
        beforeTitle: "Before revert",
        afterTitle: "After revert",
        beforeNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "bad change",
            labels: mainHead,
          },
        ],
        afterNodes: [
          {
            name: "C1",
            message: "Initial commit",
          },
          {
            name: "C2",
            message: "bad change",
          },
          {
            name: "C3",
            message: "revert bad change",
            tone: "new",
            labels: mainHead,
          },
        ],
      },
    },

    "git tag": {
      whatItDoes: "Lists the tags that already exist in the repository.",
      graphChanges: [
        "No commit node is created.",
        "No branch pointer moves.",
        "It only prints tag names in the terminal.",
      ],
      graphExample: sameGraph,
    },

    "git tag <name>": {
      whatItDoes: "Adds a permanent label to the commit you are currently on.",
      graphChanges: [
        "A tag label appears on the current commit.",
        "HEAD does not move.",
        "The current branch does not move.",
      ],
      graphExample: {
        beforeTitle: "Before tag",
        afterTitle: "After tag",
        beforeNodes: [
          {
            name: "C1",
            message: "Release commit",
            labels: mainHead,
          },
        ],
        afterNodes: [
          {
            name: "C1",
            message: "Release commit",
            labels: [
              { text: "main", type: "branch" },
              { text: "v1.0", type: "tag" },
              { text: "HEAD", type: "head" },
            ],
          },
        ],
      },
    },

    "git status": {
      whatItDoes: "Tells you where you are and whether the repository is clean in GitBattle.",
      graphChanges: [
        "No commit node is created.",
        "HEAD does not move.",
        "It only prints the repository status.",
      ],
      graphExample: sameGraph,
    },

    "git log --oneline <ref>": {
      whatItDoes: "Prints the commit history in a shorter one-line format.",
      graphChanges: [
        "No graph structure changes.",
        "The command reads history from the chosen reference.",
        "It helps you inspect commit order.",
      ],
      graphExample: sameGraph,
    },

    "git describe <ref>": {
      whatItDoes: "Finds a human-readable name for a commit using nearby tags.",
      graphChanges: [
        "No commit node is created.",
        "No labels move.",
        "It only describes an existing commit.",
      ],
      graphExample: {
        beforeTitle: "Before describe",
        afterTitle: "After describe",
        beforeNodes: [
          {
            name: "C1",
            message: "Release commit",
            labels: [
              { text: "v1.0", type: "tag" },
            ],
          },
          {
            name: "C2",
            message: "later work",
            labels: mainHead,
          },
        ],
        afterNodes: [
          {
            name: "C1",
            message: "Release commit",
            labels: [
              { text: "v1.0", type: "tag" },
            ],
          },
          {
            name: "C2",
            message: "later work",
            labels: mainHead,
          },
        ],
      },
    },
  };


  return lessons[command] ?? {
    whatItDoes: description,
    graphChanges: [
      "This command is available in GitBattle.",
      "The terminal output explains what happened.",
      "Use the graph to check whether the command helped match the target.",
    ],
    graphExample: sameGraph,
  };
}


function DocumentationGraph({ title, nodes }: { title: string; nodes: GraphNode[] }) {
  return (
    <div className="documentation-graph">

      <p className="documentation-graph-title font-press-start">
        {title}
      </p>

      <div className="documentation-graph-row">

        {nodes.map((node, index) => (
          <div className="documentation-graph-step" key={`${node.name}-${index}`}>

            <div className={`documentation-node documentation-node-${node.tone ?? "normal"}`}>
              {node.name}
            </div>

            <p className="documentation-node-message">
              {node.message}
            </p>

            <div className="documentation-node-labels">

              {node.labels?.map((label) => (
                <span
                  className={`documentation-node-label documentation-node-label-${label.type ?? "branch"}`}
                  key={`${node.name}-${label.text}`}
                >
                  {label.text}
                </span>
              ))}

            </div>

            {index < nodes.length - 1 && (
              <span className="documentation-arrow" aria-hidden="true" />
            )}

          </div>
        ))}

      </div>

    </div>
  );
}


function DocumentationDetail() {
  const { commandId } = useParams();

  const doc = documentationData.find((item) => item.id === commandId);


  if (!doc) {
    return (
      <section className="documentation-page">

        <BackBtn />

        <h1 className="documentation-detail-title font-press-start">
          Documentation Not Found
        </h1>

      </section>
    );
  }


  const lesson = getCommandLesson(doc.command, doc.description);


  return (
    <section className="documentation-page">

      <BackBtn />

      <h1 className="documentation-detail-title font-press-start">
        {doc.title}
      </h1>

      <article className="documentation-lesson-card">

        <section className="documentation-lesson-section">

          <h2 className="documentation-lesson-heading">
            What It Does
          </h2>

          <p>
            {lesson.whatItDoes}
          </p>

        </section>

        <section className="documentation-lesson-section">

          <h2 className="documentation-lesson-heading">
            What Changes In The Graph
          </h2>

          <ul>
            {lesson.graphChanges.map((change) => (
              <li key={change}>
                {change}
              </li>
            ))}
          </ul>

        </section>

        <section className="documentation-lesson-section">

          <h2 className="documentation-lesson-heading">
            Before To After
          </h2>

          <div className="documentation-graph-comparison">

            <DocumentationGraph
              title={lesson.graphExample.beforeTitle}
              nodes={lesson.graphExample.beforeNodes}
            />

            <DocumentationGraph
              title={lesson.graphExample.afterTitle}
              nodes={lesson.graphExample.afterNodes}
            />

          </div>

        </section>

      </article>

    </section>
  );
}

export default DocumentationDetail;
