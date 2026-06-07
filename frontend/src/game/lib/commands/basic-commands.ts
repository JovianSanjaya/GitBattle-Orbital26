
// basic commands include git commit , git status, git help

import type { GitState, Terminal, TerminalType} from "../../../types/git";
import type { ResultType } from "./helpers";
import { getCurrentBranchName, getHeadCommitId, keepState, makeCommit, createTerminalLine } from "./helpers";
import {gitHelpData} from  "../data/git-help-data";




// handle git help
export function handleHelp(state: GitState): ResultType{
    return {
        newState: state,
        lines: gitHelpData.map(([type, text]) => createTerminalLine(type as TerminalType, text)),
    }
}



// handle git status
export function handleStatus(state: GitState): ResultType{
    
    const branchName = getCurrentBranchName(state);

    const lines: Terminal[] = [];

    if(branchName){

        lines.push(createTerminalLine("output", `On branch ${branchName}`));

    }else{

        const headId = getHeadCommitId(state);

        lines.push(createTerminalLine("output", `HEAD detached at ${headId?.slice(0, 7) ?? "unknown"}`));
        
    }

    const string = `Changes to be committed:i mea 

	    modified:   <some files>

    Ready to commit! (as always in this demo)`;

    lines.push(createTerminalLine("info", string));

    return {newState: state, lines};
}




// handle git commit 
export function handleCommit(state: GitState, par: string[]): ResultType{
    const isAmend = par.includes("--amend");
    const msg = findMessage(par);

    if(!isAmend){

        const parentId = getHeadCommitId(state);
        const parentIdArray = parentId ? [parentId] : [];
        const newCommit = makeCommit(msg, parentIdArray);
        const branches = {...state.branches};


        if(state.head.type === "branch"){
            branches[state.branches.name] = newCommit.id;
        }

        const branchLabel = state.head.type === "branch" ? state.head.name : "HEAD (Detached)";


        const currState: GitState = {
            ...state,
            commits: {...state.commits, [newCommit.id] : newCommit}, 
            branches
        };


        const currLines: Terminal[] = [
            createTerminalLine("success", `[${branchLabel} ${newCommit.hash}] ${msg}`),
        ];

        return {
            newState: currState,
            lines: currLines,
        };
    }


    // to handle ammending commit message in detached mode 
    if(state.head.type !== "branch"){
        return keepState(state, "error", "error: ammending commit messages while in HEAD detached mode is not supported");
    }


    // to handle no commit at all in the branch
    const oldCommitId = state.head.type === "branch" ? state.branches[state.head.name] : undefined;
    if(!oldCommitId){
         return keepState(state, "error", "error: there is no commit in current branch");
    }


    //to handle particular commit does not exist in the branch
    const oldCommit = state.commits[oldCommitId];
    if(!oldCommit){
        return keepState(state, "error", "error: commit not found");
    }

    const amended = makeCommit(msg, oldCommit.parentIds);

    const newCommits = {
        ...state.commits, 
        [amended.id] : amended
    };

    const newBranches = {
        ...state.branches,
         [state.head.name]: amended.id
    };

    const newState = {
        ...state,
        commits: newCommits,
        branches: newBranches,
    }

    const newLines = [
        createTerminalLine("success", `[${state.head.name} ${amended.hash}] ${msg} (ammended)`),
    ]

    return {
        newState: newState,
        lines: newLines,
    }
}

function findMessage(par: string[]): string{
    for(let i = 0; i < par.length - 1; i++){
        return par[i + 1];
    }

    return "";
}






