from google import genai

API_KEY = "AIzaSyDGu_RLE9U2cBGsq9SRghxLEinBlLb6YQk"
MODEL = "models/gemini-2.5-flash-lite"
N = 6
MESSAGE = f'generate a {N} by {N} array where the elements \
    are from the list [P, T, R]. \
    Must randomly specify one "starting point" labelled "S", \
    and one "ending point" labelled "F", the two should not be seperated less than {N} entries. \
    The "P" elements must be connected and form a pathfrom "S" to "F" (diagonals are allowed). \
    Output this array in the format: """{{"map":[[], [], [], [], []]}}"""'
MAP_PATH = r"backend_data\map.json"

def ask_llm(key, model_id, messages, temperature=0.7):
    client = genai.Client(api_key=key)
    response = client.models.generate_content(
        model=model_id,
        contents=messages,
        config={
            'response_mime_type': 'application/json'
    })
    return (response.text)

def store_map(filename, content):
    with open (filename, 'w') as file:
        file.write(content)

def main():
    response = ask_llm(API_KEY,MODEL, MESSAGE)
    store_map(MAP_PATH, response)

if __name__ == "__main__":
    main()
