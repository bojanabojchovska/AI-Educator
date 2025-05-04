import os
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

def load_document(file):
    name, extension = os.path.splitext(file)
    if extension == ".pdf":
        print(f"Loading {file}")
        loader = PyPDFLoader(file)
    else:
        print("Document format is not supported!")
        return None
    data = loader.load()
    return data

def format_document(data):
    text = ""
    loaded_document = load_document(data)
    for i in range(len(loaded_document)):
        text += loaded_document[i].page_content[:]
    return text

def chunk_data(data, chunk_size):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=128)
    chunks = text_splitter.split_documents(data)
    return chunks

def get_chunks_for_file(file, chunk_size):
    document = load_document(file)
    chunks = chunk_data(document, chunk_size)
    return chunks