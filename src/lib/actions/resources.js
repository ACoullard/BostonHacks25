'use server';

// this file will run on the server and should contain the 
// logic for storing world data information, 
// finding relevent world data stores, 
// and fetching it out of store.

const possible_base_actions = ["move", "look"]
const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1], [0,0]]

export async function getRoomPrompt(direction) {
    const base_sys_prompt = "You are the narrator of a text-based adventure game. You describe the environment and what the player sees based on their actions. Keep descriptions engaging. Limit your response to 2-3 sentences. Here is the description of what the user is looking at: "


    return base_sys_prompt + "You are in a dark room. There is a door to the north.";

}




// returns out one of a set actions that the user can take
export async function determineAction(user_input) {
    return {
        type: "look",
        prompt: getRoomPrompt(directions[directions.length - 1])
    }
}