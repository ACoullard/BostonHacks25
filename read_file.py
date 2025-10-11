//reading json file
import json

def load_maze(filename):
    """Load maze data from a JSON file."""
    with open(filename, "r") as f:
        data = json.load(f)
    return data

//describing the json file
def describe_maze(maze_data):
    """Print environment description and visual grid."""
    print("\nEnvironment:", maze_data["environment"])
    print("Maze layout:")
    for row in maze_data["grid"]:
        print("".join(row))

//finding player position
def find_player(grid):
    """Return (row, col) of the player."""
    for r, row in enumerate(grid):
        for c, val in enumerate(row):
            if val == "P":
                return r, c
    return None

