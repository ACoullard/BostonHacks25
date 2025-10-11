from google import genai
from google.genai import types
import json

API_KEY = "AIzaSyDGu_RLE9U2cBGsq9SRghxLEinBlLb6YQk"
MODEL = "models/gemini-2.5-flash-lite"
MESSAGE = r'generate a 9 by 9 array where the elements \
    are from the list [P, T, R]. \
    Randomly specify a "starting point" labelled "S", \
    and a "ending point" labelled "F". \
    The "P" elements must be connected and form a pathfrom "S" to "F". \
    output this array in the format: """[[], [], [], [], []]"""'

def ask_llm(key, model_id, messages, temperature=0.7):
    client = genai.Client(api_key=key)
    response = client.models.generate_content(
        model=model_id,
        contents=messages,
        config={
            'response_mime_type': 'application/json',
            
        })
    return json.loads(response)

if __name__ == "main"
