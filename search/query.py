import requests
import json
import os

TOKENS = []
TOKEN_INDEX = 0

def load_tokens():
    global TOKENS
    try:
        token_file = os.path.join(os.path.dirname(__file__), '..', 'tokens.json')
        with open(token_file, 'r') as f:
            token_data = json.load(f)
            TOKENS = [t['token'] for t in token_data]
    except Exception as e:
        print(f"Error loading tokens: {str(e)}")
        TOKENS = []

load_tokens()

API_URL = "https://openrouter.ai/api/v1/chat/completions"
MODELS = [
    "openai/gpt-oss-120b:free",
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free"
]
MODEL_INDEX = 0

def get_next_token():
    """Get the next available token in rotation"""
    global TOKEN_INDEX
    if not TOKENS:
        return None
    token = TOKENS[TOKEN_INDEX]
    TOKEN_INDEX = (TOKEN_INDEX + 1) % len(TOKENS)
    return token

def get_next_model():
    """Get the next available model in rotation"""
    global MODEL_INDEX
    if not MODELS:
        return None
    model = MODELS[MODEL_INDEX]
    MODEL_INDEX = (MODEL_INDEX + 1) % len(MODELS)
    return model

async def simplify_query(original_query):
    """Simplify query using OpenRouter API with token rotation"""
    attempts = 0
    max_attempts = len(TOKENS) * len(MODELS) if TOKENS and MODELS else 3
    
    while attempts < max_attempts:
        attempts += 1
        token = get_next_token()
        model = get_next_model()
        
        if not token or not model:
            continue
        
        payload = {
            "model": model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a query optimizer. Convert user queries into simplified image search keywords. Extract the main subject/topic and add 'image' at the end. Be very brief (2-5 words max). Only return the simplified query, nothing else."
                },
                {
                    "role": "user",
                    "content": f"Simplify this query for image search: {original_query}"
                }
            ],
            "temperature": 0,
            "max_tokens": 50
        }
        
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(API_URL, json=payload, headers=headers, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if 'choices' in data and len(data['choices']) > 0:
                    query = data['choices'][0]['message']['content'].strip()
                    return query if query else original_query
                return original_query
            else:
                continue
                
        except (requests.exceptions.Timeout, Exception) as e:
            continue
    
    return original_query
