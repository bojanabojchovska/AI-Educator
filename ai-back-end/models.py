from langchain_huggingface import HuggingFaceEndpoint, HuggingFaceEmbeddings
import torch
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(), override=True)

def get_llm_model(repo_id="microsoft/Phi-3-mini-4k-instruct", task="text-generation", max_new_tokens=512, repetition_penalty=1.03, temperature=0.8):
    llm = HuggingFaceEndpoint(
        timeout=600,
        repo_id=repo_id,
        task=task,
        max_new_tokens=max_new_tokens,
        repetition_penalty=repetition_penalty,
        temperature=temperature

    )
    return llm

def get_embeddings_model(model_name="sentence-transformers/all-mpnet-base-v2", model_kwargs={'device': 'cpu'}, encode_kwargs = {'normalize_embeddings': False}):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model_kwargs["device"] = device
    embedding_model = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs=model_kwargs,
        encode_kwargs=encode_kwargs
    )
    return embedding_model