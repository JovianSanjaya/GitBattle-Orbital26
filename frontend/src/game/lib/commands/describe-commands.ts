import type { GitState } from "../../../types/git";
import type { ResultType } from "./helpers";
import {createTerminalLine, getHeadCommitId, getRef, getTags, keepState} from "./helpers";


export function handleDescribe(state: GitState, args: string[]): ResultType{

    const refStr = args.find((x) => !x.startsWith("-"));
    const startId = refStr ? getRef(state, refStr) : getHeadCommitId(state);

    if(!startId || !state.commits[startId]){

        const label = refStr ?? "HEAD";
        return keepState(state, "error", `error: '${label}' is not a valid ref`);
    }

    
    const tags = getTags(state);


    const queue: {id: string, distance: number}[] = [{id: startId, distance: 0}];
    const seen = new Set<string>();

    // Here we looking for the nearesst ancestor that has a tag on it
    while(queue.length > 0){
        const {id, distance} = queue.shift()!;
        if(seen.has(id)){
            continue;
        }

        seen.add(id);

        const matchingTag = Object.entries(tags).find(([, commitId]) => commitId === id);
        
        if(matchingTag){
            const tagName = matchingTag[0];

            if(distance == 0){
               
                return {
                    newState: state,
                    lines: [createTerminalLine("output", tagName)],
                }

            }

            const startCommit = state.commits[startId];
            const desc = `${tagName}-${distance}-g${startCommit.hash}`;

            return{
                newState: state,
                lines: [createTerminalLine("output", desc)],
            }
        }

        const commit = state.commits[id];

        if(commit){
            for(const parentId of commit.parentIds){
                if(!seen.has(parentId)){
                    queue.push({
                        id: parentId,
                        distance: distance + 1,
                    })
                }
            }
        }
    }

    // Search the entire history and found no tag at all.
    const label = refStr ?? "HEAD";
    return keepState(state, "error", `fatal: No tags found reachable from '${label}'.\n` + "Create a tag first: git tag v1.0");
}
