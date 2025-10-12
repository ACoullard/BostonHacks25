import fs from 'fs/promises';
import path from 'path';

const MAP_FILE = path.join(process.cwd(), 'public', 'map.json');

export class Maze {
  constructor(filename = MAP_FILE) {
    this.filename = filename;
    this.grid = [];
    this.rows = 0;
    this.cols = 0;
    this.playerPos = null;
  }

  async load() {
    const file = await fs.readFile(this.filename, 'utf-8');
    const data = JSON.parse(file);
    this.grid = data.map;
    this.rows = this.grid.length;
    this.cols = this.grid[0].length;
    this.playerPos = this.findPlayer();
  }

  findPlayer() {
    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[r].length; c++) {
        if (this.grid[r][c] === 'P') {
          return [r, c];
        }
      }
    }
    throw new Error('Player not found in maze!');
  }

  getSurroundings() {
    const [r, c] = this.playerPos;
    const surroundings = {};
    const directions = {
      up: [r - 1, c],
      down: [r + 1, c],
      left: [r, c - 1],
      right: [r, c + 1],
      'up-left': [r - 1, c - 1],
      'up-right': [r - 1, c + 1],
      'down-left': [r + 1, c - 1],
      'down-right': [r + 1, c + 1],
    };
    for (const [direction, [dr, dc]] of Object.entries(directions)) {
      if (dr >= 0 && dr < this.rows && dc >= 0 && dc < this.cols) {
        surroundings[direction] = this.grid[dr][dc];
      } else {
        surroundings[direction] = '#';
      }
    }
    return surroundings;
  }

  move(direction) {
    const moves = {
      up: [-1, 0],
      down: [1, 0],
      left: [0, -1],
      right: [0, 1],
      'up-left': [-1, -1],
      'up-right': [-1, 1],
      'down-left': [1, -1],
      'down-right': [1, 1],
    };
    if (!(direction in moves)) {
      return 'Invalid direction.';
    }
    const [r, c] = this.playerPos;
    const [dr, dc] = moves[direction];
    let newR = (r + dr + this.rows) % this.rows;
    let newC = (c + dc + this.cols) % this.cols;
    const target = this.grid[newR][newC];
    if (target === '#') {
      return 'You bump into a wall.';
    } else if (target === 'E') {
      this.grid[r][c] = ' ';
      this.grid[newR][newC] = 'P';
      this.playerPos = [newR, newC];
      return 'You found the exit!';
    } else {
      this.grid[r][c] = ' ';
      this.grid[newR][newC] = 'P';
      this.playerPos = [newR, newC];
      return `You move ${direction}.`;
    }
  }
}

// Example usage:
// const maze = new Maze();
// await maze.load();
// console.log('Initial position:', maze.playerPos);
// console.log('Surroundings:', maze.getSurroundings());
// maze.move('left');
// console.log('After moving left:', maze.playerPos);
// console.log('Surroundings:', maze.getSurroundings());
