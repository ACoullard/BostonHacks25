'use server';
import { generateMapDescriptions } from "../generate_descriptions";

// this file will run on the server and should contain the 
// logic for storing world data information, 
// finding relevent world data stores, 
// and fetching it out of store.

const possible_base_actions = ["move", "look"]
const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1], [0, 0]]

let current_Location = [0, 0];
const world_map = await generateMapDescriptions(9, 9)

export async function getRoomPrompt(surrounding, action) {
    const base_sys_prompt = `You are the narrator of a text-based adventure game. \
    You describe the environment and what the player sees based on their actions and surroundings. \
    Keep descriptions engaging. \
    Limit your response to 2-3 sentences. \
    the user is in" ${surrounding}  " and the user just did" + ${action}`;

    return base_sys_prompt;

}


// returns out one of a set actions that the user can take
export async function determineAction(user_input) {
    return {
        type: "look",
        prompt: getRoomPrompt(directions[directions.length - 1])
    }
}

export async function load_map(filename) {
    const file = await fs.readFile(filename, 'utf-8');
    const data = JSON.parse(file);
    const grid = data.map;
    return grid;
}

export async function findPlayer(grid) {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] == 'P') {
                return [r, c];
            }
        }
    }
    throw new Error('Player not found in maze!');
}

export async function getSurroundings(grid, playerPos, direction) {
    const [r, c] = playerPos;
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
    const [dr, dc] = directions[direction];
    const section = grid[dr][dc];
    const [system, messages] = await getRoomPrompt(section, "looked" + direction);
    return [system, messages];
}

// export async function move(grid, direction, playerPos) {
//     const moves = {
//         "up": [-1, 0],
//         'down': [1, 0],
//         'left': [0, -1],
//         'right': [0, 1],
//         'up-left': [-1, -1],
//         'up-right': [-1, 1],
//         'down-left': [1, -1],
//         'down-right': [1, 1],
//     };
//     if (!(direction in moves)) {
//         return 'Invalid direction.';
//     }
//     const [dr, dc] = moves[direction];
//     let newR = (r + dr + rows) % rows;
//     let newC = (c + dc + cols) % cols;
//     const target = grid[newR][newC];
//     if (target === '#') {
//         return 'You bump into a wall.';
//     } else if (target === 'F') {
//         grid[r][c] = ' ';
//         grid[newR][newC] = 'P';
//         playerPos = [newR, newC];
//         return 'You found the exit!';
//     } else {
//         grid[r][c] = ' ';
//         grid[newR][newC] = 'P';
//         playerPos = [newR, newC];
//         return `You move ${direction}.`;
//     }
// }