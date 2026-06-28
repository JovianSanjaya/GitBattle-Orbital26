import type { GitState } from "../../../types/git";
import type { ResultType } from "./helpers";
import { keepState, getRef, isAncestor, getCommonAncestor, getFirstParentArray, makeCommit, createTerminalLine } from "./helpers";


export function handleRebase(state: GitState, args: string[]): ResultType{

    if (state.head.type !== "branch"){
        return keepState(
            state,
            "error",
            "error: HEAD is detached.\n" +
            "Switch to a branch before rebasing: git switch <branch>",
        );
    }


    const targetStr = args.find((a) => !a.startsWith("-"));

    if (!targetStr) {
        return keepState(
            state,
            "error",
            "error: target branch required.\nUsage: git rebase <branch>",
        );
    }

    return rebase(state, targetStr);

}


function rebase(state: GitState, targetStr: string): ResultType{

    const currBranch = (state.head as { type: "branch"; name: string }).name;

    const currTip = state.branches[currBranch];

    const targetTip = getRef(state, targetStr);

    if(!targetTip || !state.commits[targetTip]){
        return keepState(state, "error", `error: '${targetStr}' is not a valid ref`);
    }


    if (isAncestor(state.commits, currTip, targetTip)) {
        return keepState(state, "info", "Current branch is already based on the target. Nothing to do.");
    }

    if(isAncestor(state.commits, targetTip, currTip)){

        return keepState(state, "info", "Already up to date.");
    }

    const ancestor = getCommonAncestor(state.commits, currTip, targetTip);

    if(!ancestor){
        return keepState(state, "error", "error: no common ancestor. These branches have unrelated histories");
    }

    const chain = getFirstParentArray (state, currTip);
    const toReplay: string[] = [];

    for(const id of chain){
        if(id === ancestor){
            break;
        }

        toReplay.push(id);
    }

    toReplay.reverse();

    if (toReplay.length === 0) {
        return keepState(state, "info", "Nothing to rebase.");
    }

    return replayCommit(state, currBranch, targetTip, toReplay);
}


function replayCommit(state: GitState, currBranch: string, baseTip: string, toReplay: string[]): ResultType{

    const commits = {...state.commits};
    let parentId = baseTip;
    let lastId = baseTip;


    for(const oldId of toReplay){

        const old = commits[oldId];
        const newCommit = makeCommit(old.message, [parentId]);
        
        commits[newCommit.id] = newCommit;
        parentId = newCommit.id;
        lastId = newCommit.id;

    }

    const finalCommit = commits[lastId];
    const replayed = toReplay.length;

    const newestState = {
        ...state, 
        commits, 
        branches: {
            ...state.branches,
            [currBranch]: lastId,
        }
    }

    const newestLines = [
        createTerminalLine("output", `Successfully rebased ${replayed} commit${replayed !== 1 ? "s" : ""}.`),
        createTerminalLine("success", `HEAD is now at ${finalCommit.hash} ${finalCommit.message}`),
    ]

    return {
        newState: newestState,
        lines: newestLines,
    }

}
