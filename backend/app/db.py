import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# MongoDB configuration
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = "rables"

client = MongoClient(MONGO_URL)
db = client[DB_NAME]

def get_db():
    try:
        yield db
    finally:
        pass
