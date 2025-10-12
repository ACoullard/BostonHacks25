'use server';
import { generateMapDescriptions } from "../generate_descriptions";
import { generateMaze } from "../generate_map";

import { findRelevantContent, generateEmbedding } from "../embeddings";
// this file will run on the server and should contain the 
// logic for storing world data information, 
// finding relevent world data stores, 
// and fetching it out of store.

const possible_base_actions = ["move", "look"]
const possible_directions = {"north": [-1, 0], "south": [1, 0], "west": [0, -1], "east": [0, 1], "north-east": [-1, 1], "north-west": [-1, -1], "south-east": [1, 1], "south-west": [1, -1], "center": [0, 0]}

const base_embeddings = await Promise.all(possible_base_actions.map(async action => ({
  id: action, 
  embedding: await generateEmbedding(action)
})));
const direction_embeddings = await Promise.all(Object.keys(possible_directions).map(async direction => ({
  id: direction, 
  embedding: await generateEmbedding(direction)
})));

let cur_direction = "center";

const world_tile_types = await generateMaze(6);
console.log(world_tile_types);
const world_tile_descriptions = await generateMapDescriptions(world_tile_types)
console.log(world_tile_descriptions);
export let current_Location = await findPlayer(world_tile_types);
console.log(current_Location);

const sys_prompt = "You are the narrator of a text-based adventure game.";

export async function getRoomPrompt(surrounding, action) {
    const base_sys_prompt = `${sys_prompt} You describe the environment and what the player sees based on their actions and surroundings. \
    Keep descriptions engaging. \
    Limit your response to 2-3 sentences. \
    the user is in " ${surrounding}  " and the user just "  ${action}`;

    return base_sys_prompt;

}


// returns out one of a set actions that the user can take
export async function determineAction(user_input) {

    const query = "currently facing " + cur_direction + " and then " + user_input

    const base_action = (await findRelevantContent(user_input, base_embeddings, 0.5, 1))[0]?.id
    const direction = (await findRelevantContent(query, direction_embeddings, 0.5, 1))[0]?.id

    let prompt = "";
    cur_direction = direction;
    if (base_action == "move") {
        prompt = await move(world_tile_types, direction);
    } else if (base_action == "look") {
        prompt = await getSurroundings(world_tile_types, direction);
    } else {
        throw "invalid direction"
    }

    console.log("##########################", base_action, direction)
    console.log(current_Location, "facing ", possible_directions[cur_direction]);
    return {
        type: base_action,
        prompt: prompt
    }
}

export async function load_map(filename) {
    const file = await fs.readFile(filename, 'utf-8');
    const data = JSON.parse(file);
    world_map = data.map;
}

export async function findPlayer(grid) {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] == 'S') {
                return [r, c];
            }
        }
    }
    throw new Error('Player not found in maze!');
}

export async function getCurrentDescription(grid, current_Location) {
    return `${sys_prompt}. Explain to player that they are on a road, and that they could look around`;
}

export async function getSurroundings(grid, direction, type = "looked") {
    const [r, c] = current_Location;

    const coords = possible_directions[direction]
    let [newR, newC] = [r + coords[0], c + coords[1]]
    if (newR == grid.length) {
        newR = 0;
    }
    if (newR == -1) {
        newR = grid.length - 1;
    }
    if (newC == grid[newR].length) {
        newC = 0;
    }
    if (newC == -1) {
        newC = grid[newR].length - 1;
    }
    const section = world_tile_descriptions[newR][newC];
    const system = await getRoomPrompt(section, type + " " + direction);
    return system;
}

export async function move(grid, direction) {
    let [r, c] = current_Location;
    const type = "moved";

    const coords = possible_directions[direction]

    let [newR, newC] = [r + coords[0], c + coords[1]];

    console.log("new coords: ", newR, newC)
    if (newR == grid.length) {
        newR = 0;
    }
    if (newR == -1) {
        newR = grid.length - 1;
    }
    if (newC == grid[newR].length) {
        newC = 0;
    }
    if (newC == -1) {
        newC = grid[newR].length - 1;
    }

    const desciption = world_tile_descriptions[newR][newC];
    const tile_type = grid[newR][newC];

    console.log("target: ", tile_type)
    if (tile_type !== 'P') {
        // console.log(world_map);
        return await `${sys_prompt} You describe the environment and what the player sees based on their actions and surroundings. \
    Keep descriptions engaging. \
    Limit your response to 2-3 sentences. \
    the user is facing  ${desciption}   and the user just   ${type}  ${direction}` + ". generate a text explaining that the player cannot go this direction.";
    }
    else if (tile_type == 'F') {
        // grid[r][c] = 'P';
        // grid[newR][newC] = 'S';
        current_Location = [newR, newC];
        // console.log(world_map);
        return `${sys_prompt}. explain to the player that they have won the game.`;
    } else if ( tile_type == 'S') {
        // grid[r][c] = 'P';
        // grid[newR][newC] = 'S';
        current_Location = [newR, newC];
        // console.log(world_map);
        return `${sys_prompt}. explain quickly to the player that they have reach a new location, which is road, as before.`;
    }
    else {
        current_Location = [newR, newC];
        return await `${sys_prompt} You describe the environment and what the player sees based on their actions and surroundings. \
    Keep descriptions engaging. \
    Limit your response to 2-3 sentences. \
    the user is facing  ${desciption}   and the user just   ${type}  ${direction}` + ". generate a text explaining the user moving to this new location.";
    }
}