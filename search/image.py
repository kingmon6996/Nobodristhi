import requests
import time
from database import tokendb

LIMIT = 5

async def load_tokens():
    try:
        async with tokendb.token_pool.acquire() as connection:
            tokens = await connection.fetch('SELECT token, cooldown, time FROM serpapi')
            return [dict(record) for record in tokens]
    except Exception as e:
        return []

async def mark_token_expired(token_value):
    try:
        async with tokendb.token_pool.acquire() as connection:
            await connection.execute(
                'UPDATE serpapi SET cooldown = true, time = $1 WHERE token = $2',
                time.time(),
                token_value
            )
    except Exception as e:
        pass

def get_active_token(tokens):
    for token_obj in tokens:
        if not token_obj.get("cooldown", False) and token_obj["token"]:
            return token_obj
    return None

async def get_image(query):
    tokens = await load_tokens()
    url = "https://serpapi.com/search"

    while True:
        token_obj = get_active_token(tokens)
        
        if not token_obj:
            return None

        current_token = token_obj["token"]
        
        params = {
            "engine": "google_images",
            "q": query,
            "api_key": current_token
        }

        try:
            response = requests.get(url, params=params)
            data = response.json()
            
            if "error" in data or response.status_code == 403 or response.status_code == 401:
                await mark_token_expired(current_token)
                tokens = await load_tokens() 
                continue
            
            images = [
                img["original"]
                for img in data.get("images_results", [])
                if img.get("original")
            ]
            
            if images:
                selected_images = images[:LIMIT]
                return selected_images
            else:
                return None
            
        except Exception as e:
            await mark_token_expired(current_token)
            tokens = await load_tokens() 
            continue


