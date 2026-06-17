import type { Commit, GitState, Graph, LayoutEdge, LayoutNode } from "../../types/git";      


export const BRANCH_COLORS = [
  "#1b0d47",
  "#0097b2",
  "#F97316",
  "#22C55E",
  "#EAB308",
  "#EC4899",
  "#60A5FA",
];


function getBranchHeads(state: GitState): string[] {
  const branchHeads = Object.values(state.branches).filter(Boolean);

  if (state.head.type === "detached" && state.head.commitId) {
    branchHeads.push(state.head.commitId);
  }

  return branchHeads;
}



function getReachableCommitIds(state: GitState): Set<string> {
    const commitIds = new Set<string>();

    getBranchHeads(state).forEach((head) => {
        const stack = [head];

        while(stack.length > 0){
            const commitId = stack.pop()!;
            const commit = state.commits[commitId];

            if(commitIds.has(commitId) || !commit){
                continue;
            }

            commitIds.add(commitId);
            stack.push(...commit.parentIds);
       }
    });

    return commitIds;
}




function getVisibleCommits(state: GitState): Commit[] {
    const reachableCommitIds = getReachableCommitIds(state);
    return Object.values(state.commits).filter((commit) => reachableCommitIds.has(commit.id));
}




function makeChildrenMap(commits : Commit[]): Map<string, string[]> {
    const children = new Map<string, string[]>();


    commits.forEach((commit) => {

        commit.parentIds.forEach((parentId)=>{

            const childIds = children.get(parentId) ?? [];
            childIds.push(commit.id);
            children.set(parentId, childIds);

        });

    });

    
    return children;

}

function sortCommitsOldestFirst(commits: Commit[]): string[] {

    const children = makeChildrenMap(commits);
    const inDegree = new Map(commits.map((commit) => [commit.id, commit.parentIds.length]));
    const queue = commits.filter((commit) => commit.parentIds.length === 0).map((commit) => commit.id);
    const sortedIds: string[] = [];


     while (queue.length > 0) {
        const commitId = queue.shift()!;
        sortedIds.push(commitId);

        const childIds = children.get(commitId) ?? [];

        childIds.forEach((childId) => {
        
            const currentInDegree = inDegree.get(childId) ?? 1;
            const nextInDegree = currentInDegree - 1;

            inDegree.set(childId, nextInDegree);

            if (nextInDegree === 0) {
                queue.push(childId);
            }

        });

    }

    return sortedIds;

}


function makeRowMap(sortedIds: string[]): Map<string, number> {
    return new Map(sortedIds.map((commitId, index) => [commitId, index]));
}


function getBranchOrder(state: GitState): string[] {
    const allBranches = Object.keys(state.branches);

    const otherBranches = allBranches.filter((branch) => {
        return branch !== "main";
    });

    otherBranches.sort();

    return ["main", ...otherBranches];
}



function assignBranchColumn(state: GitState, branch: string, colMap: Map<string, number>, col: number): boolean {
  let currentId = state.branches[branch];
  let assignedCommit = false;


  while (currentId && !colMap.has(currentId)) {

    colMap.set(currentId, col);
    assignedCommit = true;

    const commit = state.commits[currentId];
    currentId = commit?.parentIds[0];

  }

  return assignedCommit;
}


function makeColumnMap(state: GitState, sortedIds: string[]): { colMap: Map<string, number>; totalCols: number } {
  const colMap = new Map<string, number>();
  let nextColumn = 0;

    for (const branchName of getBranchOrder(state)) {
        if (!state.branches[branchName]) {
        continue;
        }

        const didAssignAnyCommit = assignBranchColumn( state, branchName, colMap, nextColumn);

        if (didAssignAnyCommit) {
        nextColumn++;
        }
    }

  for (const commitId of sortedIds) {
    if (!colMap.has(commitId)) {
      colMap.set(commitId, nextColumn);
      nextColumn++;
    }
  }

  return {
    colMap,
    totalCols: Math.max(1, nextColumn),
  };
}




function makeBranchesAtMap(state: GitState): Map<string, string[]> {
  const branchesAt = new Map<string, string[]>();

  const branchEntries = Object.entries(state.branches);

  for (const [branchName, commitId] of branchEntries) {
    if (!commitId) {
      continue;
    }

    const existingBranches = branchesAt.get(commitId) ?? [];

    existingBranches.push(branchName);

    branchesAt.set(commitId, existingBranches);
  }

  return branchesAt;
}



function getHeadCommitId(state: GitState): string | null {
  if (state.head.type === "branch") {
    return state.branches[state.head.name] ?? null;
  }

  return state.head.commitId;
}


function getTagsAt(state: GitState, commitId: string): string[] {
  const tags = state.tags ?? {};
  return Object.entries(tags)
    .filter(([, id]) => id === commitId)
    .map(([name]) => name)
    .sort();
}




function getSortedBranches(state: GitState, branches: string[]): string[] {
  const headBranchName = state.head.type === "branch"
    ? state.head.name
    : null;

  return [...branches].sort((firstBranch, secondBranch) => {
    if (firstBranch === headBranchName) {
      return -1;
    }

    if (secondBranch === headBranchName) {
      return 1;
    }

    return firstBranch.localeCompare(secondBranch);
  });
}




function makeNodes( state: GitState, sortedIds: string[], rowMap: Map<string, number>, colMap: Map<string, number>, branchesAt: Map<string, string[]>,): LayoutNode[] {
  const headCommitId = getHeadCommitId(state);

  return sortedIds.map((commitId) => {
    const commit = state.commits[commitId];

    const column = colMap.get(commitId) ?? 0;
    const row = rowMap.get(commitId) ?? 0;

    const colorIndex = column % BRANCH_COLORS.length;
    const color = BRANCH_COLORS[colorIndex];

    const branchNames = branchesAt.get(commitId) ?? [];
    const sortedBranches = getSortedBranches(state, branchNames);

    const tags = getTagsAt(state, commitId);

    const node: LayoutNode = {
      id: commitId,
      col: column,
      row: row,
      color: color,
      isHead: commitId === headCommitId,
      isMerge: commit.parentIds.length > 1,
      hash: commit.hash,
      message: commit.message,
      branches: sortedBranches,
      tags: tags,
    };

    return node;
  });
}


function makeEdges(commits: Commit[]): LayoutEdge[] {
  const edges: LayoutEdge[] = [];

  for (const commit of commits) {
    for (let index = 0; index < commit.parentIds.length; index++) {
      const parentId = commit.parentIds[index];

      const edge: LayoutEdge = {
        fromId: parentId,
        toId: commit.id,
        isSecondParent: index > 0,
      };

      edges.push(edge);
    }
  }

  return edges;
}







export function computeLayout(state: GitState): Graph {
  const commits = getVisibleCommits(state);

  if (commits.length === 0) {
    return {
      nodes: [],
      edges: [],
      totalCols: 1,
      totalRows: 0,
    };
  }

  const sortedIds = sortCommitsOldestFirst(commits);

  const rowMap = makeRowMap(sortedIds);

  const columnResult = makeColumnMap(state, sortedIds);
  const colMap = columnResult.colMap;
  const totalCols = columnResult.totalCols;

  const branchesAt = makeBranchesAtMap(state);

  const nodes = makeNodes(
    state,
    sortedIds,
    rowMap,
    colMap,
    branchesAt
  );

  const edges = makeEdges(commits);


  
  return {
    nodes: nodes,
    edges: edges,
    totalCols: totalCols,
    totalRows: sortedIds.length,
  };



}