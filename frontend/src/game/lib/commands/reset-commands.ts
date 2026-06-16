
// git reset --hard HEAD~n

import type { GitState } from "../../../types/git";
import type { ResultType} from "./helpers";
import { keepState, createTerminalLine, getRef } from "./helpers";

export function handleReset(state: GitState, args: string[]): ResultType{


    if(!args.includes("--hard")){
        return keepState(
        state,
        "error",
        "error: only --hard mode is supported in GitBattle.\n" +
            "Usage: git reset --hard <ref>\n" +
            "Examples:\n" +
            "  git reset --hard HEAD~1\n" +
            "  git reset --hard HEAD~2\n" +
            "  git reset --hard <commit-hash>",
        );
    }



    if (state.head.type !== "branch") {
        return keepState(
        state,
        "error",
        "error: cannot reset while HEAD is detached.\nCheckout to a branch first: git switch <branch>",
        );
    }


    const refStr = args.find((a) => a !== "--hard");

    if (!refStr) {
        return keepState(
        state,
        "error",
        "error: ref required.\nUsage: git reset --hard HEAD~<n>",
        );
    }

    const targetId = getRef(state, refStr);

    if (!targetId) {
        return keepState(
        state,
        "error",
        `error: '${refStr}' is not a valid ref.\n` +
            "Tip: use HEAD~1 to go one commit back, HEAD~2 for two, etc.",
        );
    }



    if (!state.commits[targetId]) {
        return keepState(state, "error", `error: commit '${refStr}' does not exist`);
    }


    const targetCommit = state.commits[targetId];
    const currentBranch = state.head.name;

    

    const newestState = {
        ...state,
        branches: { ...state.branches, [currentBranch]: targetId },
    }

    const newestLines = [
        createTerminalLine(
            "success",
            `HEAD is now at ${targetCommit.hash} ${targetCommit.message}`,
        ),
    ]

    return {
        newState: newestState,
        lines: newestLines,
    };

}