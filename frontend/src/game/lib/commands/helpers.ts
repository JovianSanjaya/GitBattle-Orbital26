import type { Commit, GitState, HeadState, Terminal} from "../../../types/git";



export interface ResultType {
    newState: GitState;
    lines: Terminal[];
}



export type ParsedCommand = {
    program: string;
    gitCommand?: string;
    args: string[];
};


// generates a random unique ID
function makeId(): string {
    return crypto.randomUUID();
}



// using djb2 algorithm because it's fast and easier to utilize rather than what git uses which is SHA-256
function makeHash(str: string): string {
    let n = 5381;

    for (let i = 0; i < str.length; i++) {
        n = ((n << 5) + n + str.charCodeAt(i)) | 0;
    }

    return Math.abs(n).toString(16).padStart(7, "0").slice(0, 7);
}


// creates a new commit object with a unique ID and hash
export function makeCommit(message: string, parentIds: string[], id?: string): Commit {

    const commitId = id !== undefined ? id : makeId();

    return {
        id: commitId,
        hash: makeHash(commitId + message),
        message,
        parentIds
    };
}


// display the lines in the terminal after every command typed in the terminal
export function createTerminalLine(type: Terminal["type"], text: string): Terminal {
    return { type, text, id: makeId() };
}


// to return the state of the git state that is unchanged and return one string message. It is used when a command fails or has nothing to do
export function keepState(state: GitState, type: Terminal["type"], text: string): ResultType {
    return { newState: state, lines: [createTerminalLine(type, text)] };
}


// return tags object
export function getTags(state: GitState): Record<string, string> {

    if (state.tags === null || state.tags === undefined) {
        return {};
    }

    return state.tags;
}


// returns the commit ID that HEAD is currently pointing at
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


// returns the current branch name, or null if in detached HEAD mode
export function getCurrentBranchName(state: GitState): string | null {

    if (state.head.type === "branch") {
        return state.head.name;
    }

    return null;
}


// get an array of the first parrent of the 
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
function getCommitIdHead(state: GitState, ref: string): string | null {

    if (ref === "HEAD") {
        return getHeadCommitId(state);
    }

    return null;
}



function getCommitIdBranch(state: GitState, ref: string): string | null {
    const commitId = state.branches[ref];

    if (commitId === undefined || commitId === null) {
        return null;
    }

    return commitId;
}



function getCommitIdTag(state: GitState, ref: string): string | null {
    const tags = getTags(state);

    const commitId = tags[ref];

    if (commitId === undefined || commitId === null) {
        return null;
    }

    return commitId;
}




function getCommitIdHash(state: GitState, ref: string): string | null {

    for (const id in state.commits) {

        const commit = state.commits[id];

        if (commit.hash.startsWith(ref) || id === ref) {
            return id;
        }

    }

    return null;
}




function getCommitIdRelative(state: GitState, ref: string): string | null {
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

    const head = getCommitIdHead(state, ref);
    if (head) {
        return head;
    }

    const branch = getCommitIdBranch(state, ref);
    if (branch){
        return branch;
    }

    const tag = getCommitIdTag(state, ref);
    if (tag){
        return tag;
    } 

    const relative = getCommitIdRelative(state, ref);
    if (relative) {
        return relative;
    }

    const hash = getCommitIdHash(state, ref);
    if (hash){
        return hash;
    }

    return null;
}



export function getAncestorsSet(commits: Record<string, Commit>, startId: string): Set<string> {
    const visited = new Set<string>();
    const queue = [startId];

    while(queue.length > 0){
        const id = queue.shift()!;
        if(visited.has(id)){
            continue;
        }
        visited.add(id);

        const commit = commits[id];
        if(!commit){
            continue;
        }

        for(const p of commit.parentIds){
            queue.push(p);
        }
    }

    return visited;
}

export function isAncestor(commits: Record<string, Commit>, ancId: string, descId: string): boolean{

    const anc = getAncestorsSet(commits, descId);
    return anc.has(ancId);

}


export function getCommonAncestor(commits: Record<string, Commit>, firstId: string, secId: string): string | null{

    const firstAnc = getAncestorsSet(commits, firstId);
    const secAnc = getAncestorsSet(commits, secId);

    for(const id of firstAnc){
        if(secAnc.has(id)){
            return id;
        }
    }

    return null;

}


// The rule is not very strict for the name of the branch
export function isCorrectBranchName(name: string): boolean{
    if(!name){
        return false;    
    }

    for(const char of name){
        const isLetter = (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
        const isDigit = (char >= "0" && char <= "9");

        if(!isLetter && !isDigit){
            return false;
        }
    }

    return true;

}



export function moveHead(state: GitState, newHead: HeadState): GitState{
    return {...state, head: newHead, previousHead: state.head};
}





