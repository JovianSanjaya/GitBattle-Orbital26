
// git merge <name>

import type { GitState} from "../../../types/git";
import type { ResultType } from "./helpers";    
import {
    keepState,
    makeCommit,
    isAncestor,
    createTerminalLine,
    getRef
} from "./helpers"


export function handleMerge(state: GitState, args: string[]): ResultType{

    const branchName = args.find((x) => !x.startsWith("-"));

    if(!branchName){
        return keepState(
            state,
            "error",
            "error: branch name required."

        )
    }

    if(state.head.type !== "branch"){
        return keepState(
            state,
            "error",
            "error: HEAD is detached so cannot merge into a detached HEAD. \nSwitch to a branch first: git checkout <name>"
        )
    }

    const latestCommit = getRef(state, branchName);

    if(!latestCommit){ // we check if latest commit exist in a branch if does not exist then branch does not exist
        return keepState(
            state,
            "error",
            `error: ${branchName} is not a branch we cannot merge because it does not exist` 
        )
    }



    const currBranch = state.head.name;
    const currLatestCommit = state.branches[currBranch];


    if(!currLatestCommit){
        return keepState(state, "error", "error: no commits yet in this branch");
    }




    if(currLatestCommit === latestCommit || isAncestor(state.commits, latestCommit, currLatestCommit)){
        return keepState(state,"info", "Already up to date");
    }




    if(isAncestor(state.commits, currLatestCommit, latestCommit)){

        const commit = state.commits[latestCommit];

        const newestState = {
            ...state,
            branches : {...state.branches, [currBranch] : latestCommit},
        }


        const newestLines = [
            createTerminalLine("output", `Updating ${state.commits[currLatestCommit].hash}..${commit.hash}`),
            createTerminalLine("success", "Fast-forward"),
        ]
    
        return {
            newState: newestState,
            lines: newestLines,
        }

    }

    const mergeMsg = `Merge branch '${branchName}'`;
    const mergeCommit = makeCommit(mergeMsg, [currLatestCommit, latestCommit]);


    const newestState = {
        ...state,
        commits: { ...state.commits, [mergeCommit.id]: mergeCommit },
        branches: { ...state.branches, [currBranch]: mergeCommit.id },
    }

    const newestLines = [
        createTerminalLine("output", "Merge made by the 'ort' strategy"),
        createTerminalLine("success", `Merged '${branchName}' into '${currBranch}'`),
    ]

   return{
        newState: newestState,
        lines: newestLines,
   }
}

