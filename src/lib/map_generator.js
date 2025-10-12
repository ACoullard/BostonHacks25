import fs from 'fs/promises';
import path from 'path';

const MAP_FILE = path.join(process.cwd(), 'public', 'map.json');
const LOWER = 3;
const UPPER = 5;

export async function addLandscape(filename = MAP_FILE) {
  const file = await fs.readFile(filename, 'utf-8');
  const map = JSON.parse(file).map;
  let n = Math.floor(Math.random() * (UPPER - LOWER + 1)) + LOWER;
  let m = Math.floor(Math.random() * (UPPER - LOWER + 1)) + LOWER;
  let i = 0;
  let cols = 0;
  let rows = 0;
  for (let row_num = 0; row_num < map.length; row_num++) {
    for (let col_num = 0; col_num < map[row_num].length; col_num++) {
      if (map[row_num][col_num] === 'Q') {
        map[row_num][col_num] = i;
      }
      n--;
      if (n === 0) {
        i++;
        cols++;
        n = Math.floor(Math.random() * (UPPER - LOWER + 1)) + LOWER;
      }
    }
    m--;
    rows++;
    i -= cols;
    cols = 0;
    n = Math.floor(Math.random() * (UPPER - LOWER + 1)) + LOWER;
    if (m === 0) {
      m = Math.floor(Math.random() * (UPPER - LOWER + 1)) + LOWER;
      i += rows;
    }
  }
  return map;
}

// Example usage
// addLandscape().then(console.log);
