import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

async def simplify_query(original_query):
    url = os.getenv("URL")
    token = os.getenv("TOKEN")
    
    payload = {
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
        "top_p": 0.9
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        if response.status_code != 200:
            return original_query
        
        data = response.json()
        query = data.get("text", "").strip()
        
        return query
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return original_query
