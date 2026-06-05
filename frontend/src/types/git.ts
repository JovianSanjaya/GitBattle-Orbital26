

// For Commit
export interface Commit {
    id: string,
    hash: string,
    message: string,
    parentIds: string[],
}


// For Head 
export type HeadState = {type : "branch", name: string} | {type: "detached", commitId: string};



// For Git State
export interface GitState{
    commits: Record<string, Commit>,
    branches: Record<string, string>,
    tags?: Record<string, string>,
    head: HeadState,
    previousHead?: HeadState
}


// For Terminal 
export type TerminalType = "input" | "output" | "error" | "success" | "info";

export interface Terminal {
    type: TerminalType,
    text: string,
    id: string,
}


// For Graph
export interface LayoutNode{
    id: string,
    col: number,
    row: number,
    color: string,
    isHead: boolean,
    isMerge: boolean,
    hash: string,
    message: string,
    branches: string[],
    tags: string[],
}

export interface LayoutEdge{
    fromId: string,
    toId: string,
    isSecondParent: boolean,
}

export interface Graph{
    nodes: LayoutNode[],
    edges: LayoutEdge[],
    totalCols: number,
    totalRows: number,
}

