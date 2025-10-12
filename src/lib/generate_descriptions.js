import { GoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

const gemini = new GoogleGenerativeAI({ model: "gemini-pro" });

/**
 * Generates a 2D array of descriptions for a map, grouped by 3x3 areas.
 * @param {number} width - Number of columns in the map
 * @param {number} height - Number of rows in the map
 * @returns {Promise<string[][]>} 2D array of descriptions
 */
export async function generateDescriptions(width, height) {
	const descriptions = Array.from({ length: height }, () => Array(width).fill(""));
	const areaSize = 3;

	for (let row = 0; row < height; row += areaSize) {
		for (let col = 0; col < width; col += areaSize) {
			// 1. Generate general area description
			const areaPrompt = `Generate a short general description for a map area. The area is part of a larger world map. Keep it concise and evocative.`;
			const areaResult = await streamText({ model: gemini, prompt: areaPrompt });
			const areaDescription = await areaResult.text();

			// 2. Generate 8 detailed tile descriptions for the area
			const tilePrompt = `Given the area description: "${areaDescription}", generate 8 short, unique, but related descriptions for tiles in this area. Each should be 1-2 sentences, and not differ too much from the area description.`;
			const tileResult = await streamText({ model: gemini, prompt: tilePrompt });
			const tileDescriptionsRaw = await tileResult.text();
			// Expecting output as a list, split into 8 descriptions
			const tileDescriptions = tileDescriptionsRaw.split(/\n|\d+\. /).filter(Boolean).slice(0, 8);

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
