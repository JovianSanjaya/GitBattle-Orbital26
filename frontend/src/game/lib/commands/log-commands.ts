import type { GitState, Terminal } from "../../../types/git";
import {
    getFirstParentArray,
    getHeadCommitId,
    getTags,
    keepState,
    type ResultType,
    getRef,
    getCurrentBranchName,
    createTerminalLine,
} from "./helpers";

export function handleLog(state: GitState, args: string[]): ResultType {

    const refStr = args.find((x) => !x.startsWith("-"));
    const startId = refStr ? getRef(state, refStr) : getHeadCommitId(state);

    if (!startId) {
        if (refStr) {
            return keepState(state, "error", `error: '${refStr}' is not a valid ref`);
        }

        return keepState(state, "info", "error: your current branch has no commits yet");
    }

    const chain = getFirstParentArray(state, startId);
    const tags = getTags(state);

    const lines: Terminal[] = chain.flatMap((commitId) => {

        const commit = state.commits[commitId];

        if (!commit) {
            return [];
        }

        const refs: string[] = [];
        const currentBranch = getCurrentBranchName(state);
        const headId = getHeadCommitId(state);

        if (commitId === headId && currentBranch) {

            refs.push(`HEAD -> ${currentBranch}`);

        } else if (commitId === headId && state.head.type === "detached") {

            refs.push("HEAD");

        }

        for (const [branchName, branchTip] of Object.entries(state.branches)) {

            if (branchTip === commitId && branchName !== currentBranch) {

                refs.push(branchName);

            }

        }

        for (const [tagName, tagTip] of Object.entries(tags)) {

            if (tagTip === commitId) {

                refs.push(`tag: ${tagName}`);

            }

        }

        const decoration = refs.length > 0 ? ` (${refs.join(", ")})` : "";
        const text = `${commit.hash}${decoration} ${commit.message}`;

        return [createTerminalLine("output", text)];
    });

    if (lines.length === 0) {
        return keepState(state, "info", "no commits to show");
    }

    return {
        newState: state,
        lines: lines,
    };

}
