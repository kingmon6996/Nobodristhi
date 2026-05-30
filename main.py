from flask import Flask, jsonify, request
from flask_cors import CORS
from database import tokendb
import asyncio
from search import get_image
from search.query import simplify_query
import os
from concurrent.futures import ThreadPoolExecutor
import threading
import time

_event_loop = None
_loop_thread = None
_loop_ready = False
_db_connected = False
_db_connection_error = None

def _run_event_loop():
    global _event_loop, _loop_ready
    _event_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(_event_loop)
    _loop_ready = True
    _event_loop.run_forever()

def run_async(coro):
    if _event_loop is None or not _event_loop.is_running():
        raise RuntimeError("Event loop not running")
    return asyncio.run_coroutine_threadsafe(coro, _event_loop).result(timeout=30)

app = Flask(__name__)

API_ACCESSCODE = os.getenv('API_ACCESSCODE', None)

CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "max_age": 3600
    }
})


@app.errorhandler(500)
def handle_500_error(e):
    return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.errorhandler(404)
def handle_404_error(e):
    return jsonify({"error": "Endpoint not found. Use GET / for API documentation"}), 404

@app.route('/', methods=['GET'])
def home():
    usage_info = {
        "message": "Search Image API",
        "endpoint": "/api/search",
        "method": "POST",
        "description": "Search for images using a query",
        "request_body": {
            "AccessCode": "your_access_code (optional if not set)",
            "Query": "your_search_query"
        },
        "example": {
            "curl": "curl -X POST http://localhost:5000/api/search -H 'Content-Type: application/json' -d '{\"AccessCode\": \"your_code\", \"Query\": \"sunset\"}'",
            "request_json": {
                "AccessCode": "your_access_code",
                "Query": "sunset"
            }
        },
        "response_success": {
            "status_code": 200,
            "body": "Returns image search results"
        },
        "response_errors": {
            "400": "Invalid JSON format or missing/empty Query parameter",
            "401": "Unauthorized: Invalid AccessCode",
            "500": "Server error"
        }
    }
    return jsonify(usage_info), 200

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "database": "connected" if _db_connected else "not connected",
        "event_loop": "running" if _loop_ready else "not ready"
    }), 200


@app.route('/api/search', methods=['POST'])
def search():
    global _db_connected, _db_connection_error
    
    try:
        if not _db_connected and _db_connection_error:
            try:
                run_async(tokendb.connect())
                _db_connected = True
                _db_connection_error = None
            except Exception as e:
                return jsonify({"error": f"Database unavailable: {str(e)}"}), 503
        
        data = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON format"}), 400
        
        access_code = data.get('AccessCode')
        if API_ACCESSCODE and access_code != API_ACCESSCODE:
            return jsonify({"error": "Unauthorized: Invalid AccessCode"}), 401
        
        query_param = data.get('Query')
        print(f"Received query: {query_param}")
        if not query_param:
            return jsonify({"error": "Missing required parameter: Query"}), 400
        
        if not isinstance(query_param, str) or query_param.strip() == '':
            return jsonify({"error": "Query must be a non-empty string"}), 400
        
        simplified_query = run_async(simplify_query(query_param))
        print(f"Simplified query: {simplified_query}")
        
        result = run_async(get_image(simplified_query))
        return jsonify(result), 200
        
    except TypeError as e:
        return jsonify({"error": f"Invalid request format: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

def init_db_sync():
    global _db_connected, _db_connection_error
    try:
        run_async(tokendb.connect())
        _db_connected = True
        _db_connection_error = None
    except Exception as e:
        _db_connected = False
        _db_connection_error = str(e)

if __name__ == "__main__":
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 5000))
    
    _loop_thread = threading.Thread(target=_run_event_loop, daemon=True)
    _loop_thread.start()
    
    timeout_counter = 0
    while not _loop_ready and timeout_counter < 100:
        time.sleep(0.01)
        timeout_counter += 1
    
    if not _loop_ready:
        exit(1)
    
    init_db_sync()
    
    try:
        app.run(
            host=host,
            port=port,
            debug=False,
            threaded=True,
            use_reloader=False
        )
    except OSError as e:
        exit(1)
    except Exception as e:
        exit(1)