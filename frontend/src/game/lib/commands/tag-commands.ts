

import type { GitState } from "../../../types/git";
import { createTerminalLine, getTags, type ResultType, keepState } from "./helpers";


export function handleTag(state: GitState, args: string[]): ResultType {

  if (args.length === 0) return listTags(state);

  if (args[0] === "-d" || args[0] === "--delete") {
    return deleteTag(state, args[1]);
  }

  const tagName = args[0];
  const refStr = args[1]; 

  return createTag(state, tagName, refStr);
}




function listTags(state: GitState): ResultType{

    const tags = getTags(state);
    const names = Object.keys(tags).sort();

    if(names.length === 0){
        return keepState(state, "info", "(no tags yet)");
    }

    return {
        newState: state,
        lines: names.map((name) => createTerminalLine("output", name)),
    }
}






