
// basic commands include git commit , git status, git help

import type { GitState, Terminal } from "../../../types/git";
import type { ResultType } from "./helpers";
import { getCurrentBranchName, getHeadCommitId, keepState, makeCommit, createTerminalLine, getCommonAncestor } from "./helpers";
import {gitHelpData} from  "../data/git-help-data";


export function handleHelp(state: GitState): ResultType{
    return {
        newState: state,
        lines: gitHelpData.map((type, text) => createTerminalLine(type,text)),
    }
}

export function handleStatus(state: GitState): ResultType{
    const branchName = getCurrentBranchName(state);
    const lines: Terminal[] = [];

    if(branchName){
        lines.push(createTerminalLine("output", `On branch ${branchName}`));
    }else{
        const headId = getHeadCommitId(state);
        lines.push(createTerminalLine("output", `HEAD detached at ${headId?.slice(0, 7) ?? "unknown"}`));
    }

    const string = `Changes to be committed:

	    modified:   <some files>

    Ready to commit! (as always in this demo)`;

    lines.push(createTerminalLine("info", string));

    return {newState: state, lines};
}

