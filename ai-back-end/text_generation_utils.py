from dotenv import load_dotenv, find_dotenv
from pinecone import Pinecone
import os
from prompt_templates import *
from langchain.chains import LLMChain
from models import get_llm_model
from document_loader import format_document
import asyncio
import re
from pinecone_utils import get_vector_store

load_dotenv(find_dotenv(), override=True)

pc = Pinecone(
        api_key=os.environ.get("PINECONE_API_KEY")
    )
index = pc.Index("books")

async def get_recommended_courses(request):
    taken_courses_str = "\n".join(request.taken_courses)
    remaining_courses_str = "\n".join(request.remaining_courses)
    llm = get_llm_model(repo_id="deepseek-ai/DeepSeek-R1-Distill-Qwen-32B")
    prompt = course_recommendation_prompt_template()
    qa_chain = LLMChain(prompt=prompt, llm=llm)
    answer = await qa_chain.ainvoke({"user_courses": taken_courses_str, "remaining_courses": remaining_courses_str})
    answer = format_course_recommendation_answer(answer['text'])
    return answer

async def get_flashcards(num_flashcards, file):
    llm = get_llm_model(repo_id="mistralai/Mistral-7B-Instruct-v0.3", task="conversational")
    prompt = flash_cards_prompt_template(num_flashcards)
    qa_chain = LLMChain(prompt=prompt, llm=llm)
    text = await asyncio.to_thread(format_document, file)
    answer = await qa_chain.ainvoke({"text": text})
    answer = answer['text']
    print(answer)
    answer = format_flashcard_answer(answer)
    return answer

def format_flashcard_answer(answer):
    print(answer)
    if "</think>" in answer:
        answer = answer.split("</think>")[1].strip()
    split_text = answer.split("\n")
    print(split_text)
    split_text = [s.strip() for s in split_text if s.strip()]
    print(split_text)
    start_index = None
    for i, x in enumerate(split_text):
        if x.lower().startswith("q1:"):
            start_index = i
            break
    if start_index is not None:
        split_text = split_text[start_index:]
    pairs = []
    pair_counter = 1
    for i in range(0, len(split_text) - 1, 2):
        q = re.split(r"Q\d:\s*", split_text[i])[1].strip()
        a = re.split(r"A\d:\s*", split_text[i+1])[1].strip()
        pairs.append({
             f"Question {pair_counter}": q,
             f"Answer {pair_counter}": a
         })
        pair_counter += 1
    print(pairs)
    return pairs

def format_course_recommendation_answer(answer):
    if "</think>" in answer:
        answer = answer.split("</think>")[1].strip()
    print(answer)
    courses = [c.strip() for c in answer.split("\n") if c.strip()]
    print(courses)
    return courses

def get_similarity_by_query(query, pdf_id, k):
    vector_store = get_vector_store()
    result = vector_store.similarity_search(query, k=k, filter={"pdf-id": pdf_id})
    return result

def get_generated_text(query, pdf_id, k):
    llm = get_llm_model(repo_id="mistralai/Mistral-7B-Instruct-v0.3")
    prompt = chatbot_prompt_template()
    qa_chain = LLMChain(prompt=prompt, llm=llm)
    similarities = get_similarity_by_query(query, pdf_id, k)
    context = "\n".join([similarity.page_content for similarity in similarities])
    answer = qa_chain.run({"context": context, "question": query})
    answer = format_chatbot_answer(answer)
    return answer

def format_chatbot_answer(answer):
    answer = answer.strip()
    if "Answer:" in answer:
        answer = answer.split("Answer:")[1].strip()
    return answer