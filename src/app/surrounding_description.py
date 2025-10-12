from google import genai
API_KEY = "AIzaSyDGu_RLE9U2cBGsq9SRghxLEinBlLb6YQk"
MODEL = "models/gemini-2.5-flash-lite"

environment_choice = input("Select an environment: ")

MESSAGE = f'write me a paragraph of 4 sentences with a description of the {environment_choice} environment, include details of what the user might see, feel and hear in the surroundings.'

def ask_llm(key, model_id, messages, temperature=0.7):
    client = genai.Client(api_key=key)
    response = client.models.generate_content(
        model=model_id,
        contents=[messages],
        config={
            'response_mime_type': 'application/json',
            'temperature': temperature
    })
    return (response.text)

description = ask_llm(API_KEY, MODEL, MESSAGE)
print("\nAI Environment Description:\n")
print(description)
