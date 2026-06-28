import type { GitState } from "../../../types/git";
import { keepState, type ResultType, getRef, makeCommit, createTerminalLine} from "./helpers";



export function handleRevert(state: GitState, args: string[]): ResultType{

    const refs  = args.filter((x) => !x.startsWith("-"));

    if(refs.length === 0){

        return keepState(
            state,
             "error", 
            "error: at least one commit ref required.\nUsage: git revert <ref>\nExample: git revert HEAD  or  git revert HEAD~1",
        )
    }

    if (state.head.type !== "branch") {
        return keepState(
        state,
        "error",
        "error: HEAD is detached.\n" +
            "Switch to a branch before reverting: git switch <branch>",
        );
    }

    let currState = state;
    const outputLines = [];

    for(const r of refs){
        const result = revertOne(currState, r);
        
        if(result.lines.some((l) => l.type === "error")){
            return result;
        }

        outputLines.push(...result.lines);
        currState = result.newState;
    }


    return {
        newState : currState,
        lines: outputLines,
    }

}



// revert one commit

function revertOne(state: GitState, refStr: string): ResultType{

    const targetId = getRef(state, refStr);

    if(!targetId || !state.commits[targetId]){
         return keepState(
            state,
            "error",
            `error: '${refStr}' is not a valid ref.\n` +
                "Tip: run 'git log --oneline' to see commit hashes.",
        );
    }

    const currBranch = (state.head as {type: "branch", name: string}).name;
    const currTip = state.branches[currBranch];
    const targetCommit = state.commits[targetId];

    const revertMsg = `Revert "${targetCommit.message}"`;
    const revertCommit = makeCommit(revertMsg, [currTip]);


    const newestState = {
      ...state,
      commits: { ...state.commits, [revertCommit.id]: revertCommit },
      branches: { ...state.branches, [currBranch]: revertCommit.id },
    };


    const newestLines = [
      createTerminalLine("output", `Reverting ${targetCommit.hash} — ${targetCommit.message}`),
      createTerminalLine(
        "success",
        `[${currBranch} ${revertCommit.hash}] ${revertMsg}`,
      ),
    ];

    return {
        newState: newestState,
        lines: newestLines,
    }
}