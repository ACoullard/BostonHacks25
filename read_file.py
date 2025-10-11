import json

class Maze:
    def __init__(self, filename):
        with open(filename, "r") as f:
            data = json.load(f)
        self.grid = data["grid"]
        self.environment = data["environment"]

        self.rows = len(self.grid)
        self.cols = len(self.grid[0])
        self.player_pos = self.find_player()

    def find_player(self):
        for r, row in enumerate(self.grid):
            for c, val in enumerate(row):
                if val == "P":
                    return(r,c)
        raise ValueError("Player not found in maze!")

    def describe(self):
        """Print the maze and environment."""
        print(f"\nEnvironment: {self.environment}")
        for row in self.grid:
            print("".join(row))

    def get_surroundings(self):
        """Return contents of up, down, left, right blocks around player."""
        r, c = self.player_pos
        surroundings = {}

        directions = {
            "up": (r - 1, c),
            "down": (r + 1, c),
            "left": (r, c - 1),
            "right": (r, c + 1)
        }

        for direction, (dr, dc) in directions.items():
            if 0 <= dr < self.rows and 0 <= dc < self.cols:
                surroundings[direction] = self.grid[dr][dc]
            else:
                surroundings[direction] = "#"  # Treat out of bounds as wall

        return surroundings

    def move(self, direction):
        """Move player if possible, return a message describing result."""
        moves = {
            "up": (-1, 0),
            "down": (1, 0),
            "left": (0, -1),
            "right": (0, 1)
        }

        if direction not in moves:
            return "Invalid direction."

        r, c = self.player_pos
        dr, dc = moves[direction]
        new_r, new_c = r + dr, c + dc

        # Check bounds
        if not (0 <= new_r < self.rows and 0 <= new_c < self.cols):
            return "You can't move outside the maze."

        # Check cell type
        target = self.grid[new_r][new_c]
        if target == "#":
            return "You bump into a wall."
        elif target == "E":
            self.grid[r][c] = " "
            self.grid[new_r][new_c] = "P"
            self.player_pos = (new_r, new_c)
            return "🎉 You found the exit!"
        else:
            self.grid[r][c] = " "
            self.grid[new_r][new_c] = "P"
            self.player_pos = (new_r, new_c)
            return f"You move {direction}."
       