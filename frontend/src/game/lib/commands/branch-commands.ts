

// commands include git branch, git checkout, git switch

import type { GitState } from "../../../types/git";
import type { ResultType } from "./helpers";
import { createTerminalLine, getCurrentBranchName, getHeadCommitId, keepState , isCorrectBranchName} from "./helpers";
import { moveHead } from "./helpers";   




// git branch
export function handleBranch(state: GitState, args: string[]): ResultType{
    if(args.length == 0){
        return listAllBranches(state);
    }

    if(args[0] === "-d" || args[0] === "--delete"){
        return deleteBranch(state, args[1]);
    }

    return createBranch(state, args[0]);
}


// git branch helper
function listAllBranches(state: GitState): ResultType{
    const currBranch = getCurrentBranchName(state);
    const names = Object.keys(state.branches).sort() as Array<keyof GitState["branches"]>;

    if(names.length === 0){
        return keepState(state, "info", "(no branches yet)");
    }

    return {
        newState: state,
        lines: names.map(
            (name) => createTerminalLine("output", `${name  === currBranch ? "* " : "  "} ${name}`),
        ),
    }
}

// git branch -d
function deleteBranch(state: GitState, branchName: string): ResultType{
    if(!branchName){
        return keepState(state, "error", "error: branch name required");
    }

    if(state.branches[branchName] === undefined){
        return keepState(state, "error", `error: branch ${branchName} not found`);
    }

    if(state.head.type === "branch" && state.head.name === branchName){
        return keepState(
            state,
            "error",
            `error:  cannot delete branch '${branchName}', it is currently checkout out. \n ` + `Switch to another branch first, then delete.`,
        )
    }

    const branches = {...state.branches};
    delete branches[branchName];
    return {
        newState: {...state, branches},
        lines: [createTerminalLine("success",   `Deleted branch '${branchName}'`)],
    }

}


// git branch <name>
function createBranch(state: GitState, branchName: string): ResultType{
    if(!isCorrectBranchName(branchName)){
        return keepState(
            state,
            "error",
            `error: '${branchName}' is not a valid branch name. \n ` + "Branch name may only digits and letters",
        )
    }

    if(state.branches[branchName] !== undefined){
        return keepState(state, "error", `fatal: a branch '${branchName}' already exists`);
    }

    const headId = getHeadCommitId(state);

    if(!headId){
        return keepState(state, "error", "error: no commits yet so cannot create a branch");
    }

    return {
        newState: {...state, branches:{...state.branches, [branchName] : headId}},
        lines: [createTerminalLine("success",  `Created branch '${branchName}'`)],
    }

}

//git checkout
function handleCheckout(state: GitState, args: string[]): ResultType{
    if(!args[0]){
        return keepState(state, "error", "error: branch name is required")
    }

    if(args[0] === "-"){
        return switchToPrevious(state);
    }

    if (args[0] === "-b" || args[0] === "--branch") {
        return createAndSwitch(state, args[1] ?? "");
    }

    if(state.branches[args[0]] !== undefined){
        return checkoutToBranch(state, args[0]);
    }

    // note for now it can only checkout branch name  and commit.
    return checkoutCommits(state, args[0]);
}


// git checkout helpers
function checkoutToBranch(state: GitState, branchName: string): ResultType{

    if(state.branches[branchName] === undefined){
        return keepState(
            state,
            "error",
            `error: there is no branch ${branchName} available. \n` + `Run 'git branch' to see all the branches`,
        );
    }

    return{
        newState: moveHead(state, { type: "branch", name: branchName }),
        lines: [createTerminalLine("success", `Switched to branch '${branchName}'`)],
    }
}


function switchToPrevious(state: GitState): ResultType{
    if(!state.previousHead){
        return keepState(
            state,
            "error",
            "error: cannot 'git checkout -' since there is no branch to switch to "
        )
    }

    const prevHead = state.previousHead;

    if(prevHead.type === "branch" && state.branches[prevHead.name] === undefined){
        return keepState(
            state,
            "error",
            `error: previous branch ${prevHead.name} is not found`
            
        )
    }

    // The commitId shouldn't be produced 7 chars from beginning since two commits may have first 7 chars the same when comparing. So only slice when we want to show.
    const label = prevHead.type === "branch" ? prevHead.name : `${prevHead.commitId.slice(0, 7)} (detached)`;

    return {
        newState: {...state, },
        lines: [createTerminalLine("success", `Successfully switched to branch ${label}`)],
    }
}



function checkoutCommits(state: GitState, commitId: string): ResultType{

    return {
        newState: {...state},
        lines: [],
    }
}


function createAndSwitch(state: GitState, branchName: string): ResultType{


    return {
        newState: {...state},
        lines: [],
    }
}


