import asyncpg 
import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.token_pool = None

    async def connect(self):
        self.token_pool = await asyncpg.create_pool(
            host=os.getenv('POSTGRES_TOKEN_HOST'),
            port=int(os.getenv('POSTGRES_TOKEN_PORT')),
            database='postgres',
            user=os.getenv('POSTGRES_TOKEN_USERNAME'),
            password=os.getenv('POSTGRES_TOKEN_PASSWORD'),
            ssl='require',
            timeout=10,
            min_size=1,
            max_size=20,
            command_timeout=30,
            statement_cache_size=0
        )

    async def refresh_connection(self):
        while True:
            try:
                await asyncio.sleep(30)
                async with self.token_pool.acquire() as connection:
                    await connection.fetchval('SELECT 1')
            except Exception as e:
                try:
                    if self.token_pool:
                        await self.token_pool.close()
                    await self.connect()
                except Exception as reconnect_error:
                    await asyncio.sleep(10)

    async def close(self):
        if self.token_pool:
            await self.token_pool.close()

tokendb = Database()

