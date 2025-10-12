import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const gemini = google("gemini-2.5-flash-lite");

/**
 * Generates a 2D array of descriptions for a map, grouped by 3x3 areas.
 * @param {number} width - Number of columns in the map
 * @param {number} height - Number of rows in the map
 * @returns {Promise<string[][]>} 2D array of descriptions
 */
export async function fromScratchGenerateMapDescriptions(width, height) {
   const descriptions = Array.from({ length: height }, () => Array(width).fill(""));
   const areaSize = 3;

   for (let row = 0; row < height; row += areaSize) {
	   for (let col = 0; col < width; col += areaSize) {
		   // 1. Generate general area description (structured)
		   const areaPrompt = `Generate a short general description for a map area. The area is part of a larger world map. Keep it concise and evocative.`;
		   const areaSchema = z.object({ description: z.string() });
		   const areaResult = await generateObject({
			   model: gemini,
			   prompt: areaPrompt,
			   schema: areaSchema,
		   });
		   const areaDescription = areaResult.object.description;

		   // 2. Generate 8 detailed tile descriptions for the area (structured)
		   const tilePrompt = `Given the area description: "${areaDescription}", generate 8 short, unique, but related descriptions for tiles in this area. Each should be 1-2 sentences, and not differ too much from the area description.`;
		   const tileSchema = z.object({
			   tiles: z.array(z.string()).length(8)
		   });
		   const tileResult = await generateObject({
			   model: gemini,
			   prompt: tilePrompt,
			   schema: tileSchema,
		   });
		   const tileDescriptions = tileResult.object.tiles;

		   // 3. Assign descriptions to tiles in the 3x3 area
		   let idx = 0;
		   for (let i = 0; i < areaSize; i++) {
			   for (let j = 0; j < areaSize; j++) {
				   const r = row + i;
				   const c = col + j;
				   if (r < height && c < width) {
					   descriptions[r][c] = idx === 4 ? areaDescription : (tileDescriptions[idx] || areaDescription);
					   idx++;
				   }
			   }
		   }
	   }
   }
	return descriptions;
}



export async function generateMapDescriptions(map) {
   const height = map.length;
   const width = map[0].length;
   
   const descriptions = Array.from({ length: height }, () => Array(width).fill(""));
   const areaSize = 3;


   for (let row = 0; row < height; row += areaSize) {
	   for (let col = 0; col < width; col += areaSize) {
		   // 1. Generate general area description (structured)
		   const areaPrompt = `Generate a short general description for a map area. The area is part of a larger world map. Keep it concise and evocative.`;
		   const areaSchema = z.object({ description: z.string() });
		   const areaResult = await generateObject({
			   model: gemini,
			   prompt: areaPrompt,
			   schema: areaSchema,
		   });
		   const areaDescription = areaResult.object.description

           const counts = {"P": 0, "Q": 0, "S": 0, "F": 0};
           for (let i = 0; i < areaSize; i++) {
			   for (let j = 0; j < areaSize; j++) {
				   const r = row + i;
				   const c = col + j;

                     if (r < height && c < width) { 
                        const tileType = map[r][c];
                        counts[tileType] = (counts[tileType] || 0) + 1;
                     }
                }
            }

        // 2. Generate detailed tile descriptions for the area (structured)
        const tilePrompt = `
Given the area description: "${areaDescription}", generate descriptions for tiles in this area.
There are ${counts["P"]} 'P' tiles (entrance/door rooms) and ${counts["Q"]} 'Q', ${counts["S"]} 'S', ${counts["F"]} 'F' tiles (non-entrance rooms).
For 'P' tiles, generate entrance/door type descriptions. For other tiles, generate non-entrance/door descriptions.
Each description should be 1-2 sentences, unique, and related to the area description.
Return an object with keys 'P', 'Q', 'S', 'F', each containing an array of descriptions of the correct length.
`;

        const tileSchema = z.object({
            P: z.array(z.string()),
            Q: z.array(z.string()),
            S: z.array(z.string()),
            F: z.array(z.string())
        });

        const tileResult = await generateObject({
            model: gemini,
            prompt: tilePrompt,
            schema: tileSchema,
        });

        // Manually slice arrays to the correct size
        const processedResult = {
            P: (tileResult.object.P || []).slice(0, counts["P"]),
            Q: (tileResult.object.Q || []).slice(0, counts["Q"]),
            S: (tileResult.object.S || []).slice(0, counts["S"]),
            F: (tileResult.object.F || []).slice(0, counts["F"])
        };

        // 3. Assign descriptions to tiles in the 3x3 area
        const typeIndices = {P: 0, Q: 0, S: 0, F: 0};
        for (let i = 0; i < areaSize; i++) {
            for (let j = 0; j < areaSize; j++) {
                const r = row + i;
                const c = col + j;
                if (r < height && c < width) {
                    const tileType = map[r][c];
                    const descArr = processedResult[tileType] || [];
                    descriptions[r][c] = descArr[typeIndices[tileType]] || areaDescription;
                    typeIndices[tileType]++;
                }
            }
        }
	   }
   }
	return descriptions;
}
