import type { GitState } from "../../../types/git";
import { createTerminalLine, getTags, type ResultType, keepState, getHeadCommitId, getRef } from "./helpers";

export function handleTag(state: GitState, args: string[]): ResultType {

    if (args.length === 0) {
        return listTags(state);
    }

    if (args[0] === "-d" || args[0] === "--delete") {
        return deleteTag(state, args[1]);
    }

    const tagName = args[0];
    const refStr = args[1];

    return createTag(state, tagName, refStr);
}

function listTags(state: GitState): ResultType {

    const tags = getTags(state);
    const names = Object.keys(tags).sort();

    if (names.length === 0) {
        return keepState(state, "info", "(no tags yet)");
    }

    return {
        newState: state,
        lines: names.map((name) => createTerminalLine("output", name)),
    };
}

function createTag(state: GitState, tagName: string, refStr?: string): ResultType {

    if (!tagName) {
        return keepState(state, "error", "error: tag name requred");
    }

    const onlyLettersAndDigits = /^[a-zA-Z0-9]+$/;

    if (!onlyLettersAndDigits.test(tagName)) {
        return keepState(
            state,
            "error",
            "error: tag name can only contain letters and digits."
        );
    }

    const tags = getTags(state);

    if (tags[tagName] !== undefined) {
        return keepState(state, "error", `error: tag '${tagName}' already exists.\nDelete it first with: git tag -d ${tagName}`);
    }

    const targetId = refStr ? getRef(state, refStr) : getHeadCommitId(state);

    if (!targetId || !state.commits[targetId]) {
        const label = refStr ?? "HEAD";

        return keepState(state, "error", `error: '${label}' does not point to a valid commit`);
    }

    const targetCommit = state.commits[targetId];
    const newestState = { ...state, tags: { ...tags, [tagName]: targetId } };
    const newestLines = [createTerminalLine("success", `Tag '${tagName}' created at ${targetCommit.hash} ${targetCommit.message}`)];

    return {
        newState: newestState,
        lines: newestLines,
    };
}

function deleteTag(state: GitState, tagName: string | undefined): ResultType {

    if (!tagName) {
        return keepState(state, "error", "error: tag name required after -d");
    }

    const tags = getTags(state);

    if (tags[tagName] === undefined) {
        return keepState(state, "error", `error: tag '${tagName}' not found`);
    }

    const newTags = { ...tags };

    delete newTags[tagName];

    const newestState = { ...state, tags: newTags };
    const newestLines = [createTerminalLine("success", `Deleted tag '${tagName}'`)];

    return {
        newState: newestState,
        lines: newestLines,
    };
}
