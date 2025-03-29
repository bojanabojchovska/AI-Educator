from dotenv import load_dotenv, find_dotenv
from prompt_templates import *
from langchain.chains import LLMChain
from models import get_llm_model
from document_loader import load_document
import asyncio
import re
load_dotenv(find_dotenv(), override=True)

async def get_recommended_courses(user_courses, remaining_courses):
    llm = get_llm_model(repo_id="deepseek-ai/DeepSeek-R1-Distill-Qwen-32B", temperature=0.9)
    prompt = course_recommendation_prompt_template()
    qa_chain = LLMChain(prompt=prompt, llm=llm)
    answer = await qa_chain.ainvoke({"user_courses": user_courses, "remaining_courses": remaining_courses})
    answer = format_course_recommendation_answer(answer['text'])
    return answer

async def get_flashcards(num_flashcards, file):
    llm = get_llm_model(repo_id="mistralai/Mistral-7B-Instruct-v0.2")
    prompt = flash_cards_prompt_template(num_flashcards)
    qa_chain = LLMChain(prompt=prompt, llm=llm)
    text = await asyncio.to_thread(load_document, file)
    answer = await qa_chain.ainvoke({"text": text})
    answer = format_flashcard_answer(answer['text'], num_flashcards)
    return answer

def format_flashcard_answer(answer, num_flashcards):
    print(answer)
    split_text = answer.split("\n")
    print(split_text)
    split_text = [s.strip() for s in split_text if s.strip()]
    print(split_text)
    pairs = []
    pair_counter = 1
    for i in range(len(split_text)):
        pair = split_text[i]
        split_pair = re.split(r'\s*;{1,4}\s*', pair)
        q = re.split(r'\s*:\s*', split_pair[0])[1]
        a = re.split(r'\s*:\s*', split_pair[1])[1]
        # q = split_pair[0].split(": ")[1]
        # a = split_pair[1].split(": ")[1]
        pairs.append({
             f"Question {i+1}": q,
             f"Answer {i+1}": a
         })
        pair_counter += 1
    print(pairs)
    # split_text = re.split(r'(Question|Answer) \d;{1,3}', answer.strip())
    # split_text = [s.strip() for s in split_text if s.strip()]
    # pairs = []
    # pair_counter = 1
    # for i in range(0, len(split_text), 4):
    #     pairs.append({
    #         f"Question {pair_counter}": split_text[i + 1],
    #         f"Answer {pair_counter}": split_text[i + 3]
    #     })
    #     pair_counter += 1
    return pairs

def format_course_recommendation_answer(answer):
    courses_whitespace = answer.split("</think>")[1]
    print(courses_whitespace)
    courses = [c.strip() for c in courses_whitespace.split("\n") if c.strip()]
    print(courses)
    return courses

