import type { ParsedCommand } from "./helpers";

export function parseCommand(command: string): ParsedCommand {

    const words: string[] = [];

    let word = "";
    let quote = "";

    for (const char of command) {

        if (quote) {

            if (char === quote) {
                quote = "";
            } else {
                word += char;
            }

            continue;
        }

        if (char === "\"" || char === "'") {
            quote = char;
            continue;
        }

        if (char === " " || char === "\t") {
            if (word) {
                words.push(word);
                word = "";
            }

            continue;
        }

        word += char;

    }

    if (word) {
        words.push(word);
    }

    return {
        program: words[0],
        gitCommand: words[1],
        args: words.slice(2),
    };

}
