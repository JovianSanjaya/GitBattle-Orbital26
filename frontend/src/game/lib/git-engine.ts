import type { GitState } from "../../types/git";
import { handleCommit, handleHelp, handleStatus } from "./commands/basic-commands";
import { handleBranch, handleCheckout } from "./commands/branch-commands";
import { keepState, type ResultType } from "./commands/helpers";
import { handleMerge } from "./commands/merge-commands";
import { parseCommand } from "./commands/parse-commands";
import { handleRebase } from "./commands/rebase-commands";
import { handleReset } from "./commands/reset-commands";
import { handleRevert } from "./commands/revert-commands";
import { handleTag } from "./commands/tag-commands";
import { handleDescribe } from "./commands/describe-commands";
import { handleLog } from "./commands/log-commands";

export function executeCommand(rawCommand: string, state: GitState): ResultType {

    const command = rawCommand.trim();

    if (!command) {
        return {
            newState: state,
            lines: [],
        };
    }

    const parsed = parseCommand(command);

    if (parsed.program !== "git") {
        return keepState(
            state,
            "error",
            `${parsed.program}: command not found\n` +
            "Tip: all commands start with 'git'. Try 'git help' to see what's available.",
        );
    }

    const gitCommand = parsed.gitCommand;

    if (!gitCommand || gitCommand === "help" || gitCommand === "--help") {

        return handleHelp(state);

    } else if (gitCommand === "status") {

        return handleStatus(state);

    } else if (gitCommand === "commit") {

        return handleCommit(state, parsed.args);

    } else if (gitCommand === "branch") {

        return handleBranch(state, parsed.args);

    } else if (gitCommand === "checkout") {

        return handleCheckout(state, parsed.args);

    } else if (gitCommand === "merge") {

        return handleMerge(state, parsed.args);

    } else if (gitCommand === "rebase") {

        return handleRebase(state, parsed.args);

    } else if (gitCommand === "reset") {

        return handleReset(state, parsed.args);

    } else if (gitCommand === "revert") {

        return handleRevert(state, parsed.args);

    } else if (gitCommand === "tag") {

        return handleTag(state, parsed.args);

    } else if (gitCommand === "log") {

        return handleLog(state, parsed.args);

    } else if (gitCommand === "describe") {

        return handleDescribe(state, parsed.args);

    } else {

        return keepState(
            state,
            "error",
            `git: '${parsed.gitCommand}' is not a git command supported in GitBattle.\n` +
            "Run 'git help' to see all available commands.",
        );

    }

}
