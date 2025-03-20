import os
from langchain.document_loaders import PyPDFLoader
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
