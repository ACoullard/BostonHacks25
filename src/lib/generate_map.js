import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

const gemini = google('gemini-2.5-flash-lite');

const mazeSchema = z.object({
  map: z.array(z.array(z.enum(["P", "Q", "S", "F"])))
});


/**
 * Generates an N x N maze where:
 * - Elements are from [P, Q]
 * - One start ('S') and one finish ('F')
 * - 'P' forms a complete connected path (diagonals allowed)
 * @param {number} N - Maze dimension (N x N)
 * @returns {Promise<{ map: string[][] }>} Generated maze object
 */
export async function generateMaze(N) {
  const prompt = `
    Generate a ${N}x${N} array where:
    - Elements are only 'P' or 'Q'
    - There is exactly one 'S' (start) and one 'F' (finish)
    - All 'P's form a connected path from 'S' to 'F' (diagonals allowed)
    - The path length should be at least ${N}
    Format strictly as JSON: {"map": [["S","P","Q",...], ...]}
  `;

  const result = await generateObject({
    model: gemini,
    prompt,
    schema: mazeSchema,
  });

  return result.object.map;
}