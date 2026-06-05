import type { Commit, GitState, Terminal} from "../../../types/git";



export interface ExecuteResult {
    newState: GitState;
    lines: Terminal[];
}



export type ParsedCommand = {
    program: string;
    gitCommand?: string;
    args: string[];
};



function makeId(): string {
    return crypto.randomUUID();
}



function makeHash(str: string): string {
    let n = 5381;

    for (let i = 0; i < str.length; i++) {
        n = ((n << 5) + n + str.charCodeAt(i)) | 0;
    }

    return Math.abs(n).toString(16).padStart(7, "0").slice(0, 7);
}



export function makeCommit(message: string, parentIds: string[], id?: string): Commit {

    const commitId = id !== undefined ? id : makeId();

    return {
        id: commitId,
        hash: makeHash(commitId + message),
        message,
        parentIds
    };
}



export function makeLine(type: Terminal["type"], text: string): Terminal {
    return { type, text, id: makeId() };
}



export function keepState(state: GitState, type: Terminal["type"], text: string): ExecuteResult {
    return { newState: state, lines: [makeLine(type, text)] };
}



export function getTags(state: GitState): Record<string, string> {

    if (state.tags === null || state.tags === undefined) {
        return {};
    }

    return state.tags;
}



export function getHeadCommitId(state: GitState): string | null {

    if (state.head.type === "branch") {

        const commitId = state.branches[state.head.name];

        if (commitId === undefined || commitId === null) {
            return null;
        }

        return commitId;
    }

    return state.head.commitId;
}



export function getCurrentBranchName(state: GitState): string | null {

    if (state.head.type === "branch") {
        return state.head.name;
    }

    return null;
}



export function getFirstParentArray(state: GitState, tipId: string): string[] {
    const chain: string[] = [];

    let current = tipId;

    while (current) {
        const commit = state.commits[current];

        if (!commit){
            break;
        }

        chain.push(current);

        if (commit.parentIds.length === 0) {
            break;
        }

        current = commit.parentIds[0];
    }
    return chain;
}


// getRef() returns Commit ID based on reference passed (can be head, branch, tag, hash, and relative ( ~ and ^)) 

function getHead(state: GitState, ref: string): string | null {

    if (ref === "HEAD") {
        return getHeadCommitId(state);
    }

    return null;
}



function getBranch(state: GitState, ref: string): string | null {
    const commitId = state.branches[ref];

    if (commitId === undefined || commitId === null) {
        return null;
    }

    return commitId;
}



function getTag(state: GitState, ref: string): string | null {
    const tags = getTags(state);

    const commitId = tags[ref];

    if (commitId === undefined || commitId === null) {
        return null;
    }

    return commitId;
}




function getHash(state: GitState, ref: string): string | null {

    for (const id in state.commits) {

        const commit = state.commits[id];

        if (commit.hash.startsWith(ref) || id === ref) {
            return id;
        }

    }

    return null;
}




function getRelative(state: GitState, ref: string): string | null {
    let split = -1;

    for (let i = 0; i < ref.length; i++) {
        if (ref[i] === "~" || ref[i] === "^") {
            split = i;
            break;
        }
    }

    if (split === -1) {
        return null;
    }

    const base = ref.slice(0, split);
    const rest = ref.slice(split);

    let currentId = getRef(state, base);

    if (!currentId) {
        return null;
    }

    let i = 0;

    while (i < rest.length) {
        if (!currentId) {
            return null;
        }

        const commit: Commit = state.commits[currentId];

        if (!commit){
            return null;
        } 

        const operator = rest[i];
        i++;

        let num = "";

        while (i < rest.length && rest[i] >= "0" && rest[i] <= "9") {
            num += rest[i];
            i++;
        }

        const n = num === "" ? 1 : Number(num);

        if (operator === "~") {
            for (let j = 0; j < n; j++) {

                const c: Commit = state.commits[currentId!];

                if (!c) {
                    currentId = null;
                } else if (c.parentIds[0] === undefined) {
                    currentId = null;
                } else {
                    currentId = c.parentIds[0];
                }

            }
        } else {
            const index = n === 0 ? 0 : n - 1;

            const parent: string = commit.parentIds[index];

            if (parent === undefined) {
                currentId = null;
            } else {
                currentId = parent;
            }

        }
    }

    return currentId;
}





export function getRef(state: GitState, ref: string): string | null {
    if (!ref){
        return null;
    }

    const head = getHead(state, ref);
    if (head) {
        return head;
    }

    const branch = getBranch(state, ref);
    if (branch){
        return branch;
    }

    const tag = getTag(state, ref);
    if (tag){
        return tag;
    } 

    const relative = getRelative(state, ref);
    if (relative) {
        return relative;
    }

    const hash = getHash(state, ref);
    if (hash){
        return hash;
    }

    return null;
}



