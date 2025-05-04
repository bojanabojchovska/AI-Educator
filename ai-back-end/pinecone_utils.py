from langchain.vectorstores import Pinecone as LangChainPinecone
from models import get_embeddings_model
from document_loader import get_chunks_for_file
import uuid
import os
from dotenv import load_dotenv, find_dotenv
from pinecone import Pinecone
import asyncio

load_dotenv(find_dotenv(), override=True)
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index = pc.Index(name="books")

def get_vector_store(index_name="books"):
    embedding_model = get_embeddings_model()
    vector_store = LangChainPinecone.from_existing_index(index_name, embedding_model)
    return vector_store

def get_vectorized_file(file, pdf_id):
    chunks = get_chunks_for_file(file, chunk_size=512)
    embedding_model = get_embeddings_model()
    vectors = [
    (
        str(uuid.uuid4()),
        embedding_model.embed_query(chunk.page_content),
        {"page": chunk.metadata.get("page", -1), "pdf-id": pdf_id, "text": chunk.page_content}
    )
    for chunk in chunks
]
    return vectors

async def add_file_to_database(file, batch_size=250):
    pdf_id = str(uuid.uuid4())
    vectors = get_vectorized_file(file, pdf_id)
    for i in range(0, len(vectors), batch_size):
        batch = vectors[i:i + batch_size]
        await asyncio.to_thread(index.upsert, batch) 
    return pdf_id
