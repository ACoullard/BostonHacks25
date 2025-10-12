'use server';
import { Plaster } from "next/font/google";
import { generateMapDescriptions } from "../generate_descriptions";

// this file will run on the server and should contain the 
// logic for storing world data information, 
// finding relevent world data stores, 
// and fetching it out of store.

const possible_base_actions = ["move", "look"]
const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1], [0, 0]]


let world_map = [["T", "R", "R", "R", "T", "T", "R", "T", "R"],
[
    "R",
    "S",
    "P",
    "R",
    "T",
    "R",
    "T",
    "R",
    "T"
],
[
    "T",
    "P",
    "R",
    "R",
    "T",
    "R",
    "T",
    "R",
    "T"
],
[
    "R",
    "P",
    "R",
    "T",
    "T",
    "R",
    "T",
    "R",
    "T"
],
[
    "T",
    "P",
    "P",
    "P",
    "P",
    "P",
    "P",
    "R",
    "T"
],
[
    "R",
    "T",
    "R",
    "T",
    "R",
    "R",
    "P",
    "R",
    "T"
],
[
    "T",
    "R",
    "T",
    "R",
    "T",
    "R",
    "P",
    "T",
    "R"
],
[
    "R",
    "T",
    "R",
    "T",
    "T",
    "R",
    "P",
    "F",
    "T"
],
[
    "T",
    "R",
    "T",
    "R",
    "R",
    "T",
    "T",
    "T",
    "R"
]
]
console.log(world_map);
let current_Location = await findPlayer(world_map);
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
    return {
        type: "move",
        prompt: await move(world_map, user_input)
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
    const directions = {
        'up': [r - 1, c],
        'down': [r + 1, c],
        'left': [r, c - 1],
        'right': [r, c + 1],
        'up-left': [r - 1, c - 1],
        'up-right': [r - 1, c + 1],
        'down-left': [r + 1, c - 1],
        'down-right': [r + 1, c + 1],
    };
    let [newR, newC] = directions[direction];
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
    const section = grid[newR][newC];
    const system = await getRoomPrompt(section, type + " " + direction);
    return system;
}

export async function move(grid, direction) {
    let [r, c] = current_Location;
    const type = "moved";
    const moves = {
        'up': [r - 1, c],
        'down': [r + 1, c],
        'left': [r, c - 1],
        'right': [r, c + 1],
        'up-left': [r - 1, c - 1],
        'up-right': [r - 1, c + 1],
        'down-left': [r + 1, c - 1],
        'down-right': [r + 1, c + 1],
    };
    if (!(direction in moves)) {
        return 'Invalid direction.';
    }

    let [newR, newC] = moves[direction];
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
    let target = grid[newR][newC];

    if (target != 'P') {
        console.log(world_map);
        return await `${sys_prompt} You describe the environment and what the player sees based on their actions and surroundings. \
    Keep descriptions engaging. \
    Limit your response to 2-3 sentences. \
    the user is facing  ${target}   and the user just   ${type}  ${direction}` + ". generate a text explaining that the player cannot go this direction.";
    }
    else if (target == 'F') {
        grid[r][c] = 'P';
        grid[newR][newC] = 'S';
        current_Location = [newR, newC];
        console.log(world_map);
        return `${sys_prompt}. explain to the player that they have won the game.`;
    }
    else {
        grid[r][c] = 'P';
        grid[newR][newC] = 'S';
        current_Location = [newR, newC];
        console.log(world_map);
        return `${sys_prompt}. explain quickly to the player that they have reach a new location, which is road, as before.`;
    }
}