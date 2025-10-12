import json
import random

MAP_FILE = r"backend_data\map.json"
LANSCAPES = []
LOWER = 3
UPPER = 5


def add_landscape(filename):
    with open(filename) as file:
        map = json.load(file)["map"]
        print(map)
    n = random.randint(LOWER, UPPER)
    m = random.randint(LOWER, UPPER)
    i = 0
    cols = 0
    rows = 0
    for row_num in len(map):
        for col_num in len(map[row_num]):
            if (map[row_num][col_num] == 'Q'):
                map[row_num][col_num] = i
            n -= 1
            if (n==0):
                i += 1
                cols += 1
                n = random.randint(LOWER, UPPER)
        m -= 1
        rows += 1
        i -= cols
        cols = 0
        n = random.randint(LOWER, UPPER)
        if (m == 0):
            m = random.randint(LOWER, UPPER)
            i += rows
    return map

def main():
    print(add_landscape(MAP_FILE))

if __name__ =='__main__':
    main()