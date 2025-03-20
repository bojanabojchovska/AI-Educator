from dotenv import load_dotenv, find_dotenv
from langchain import PromptTemplate
from langchain.chains import LLMChain
from models import get_llm_model
from document_loader import load_document
import asyncio
import re
load_dotenv(find_dotenv(), override=True)

def get_prompt_template(num_flashcards):
    prompt = PromptTemplate(
        template=f"""You are an expert at creating flashcards or question-answer pairs based on a given text. Design the flash cards to test my understanding of the key concepts, facts, and ideas discussed in the text above. Keep each flash card simple and clear, focusing on the most important information. Questions on the front should be specific and unambiguous, helping me recall precise details or concepts. The content generated should be about the core concept of the text and not trivial things.
Generate a total of {num_flashcards} question-answer pairs.

        FORMAT THE OUTPUT LIKE THIS:
        Q1: Where is the Dead Sea located?;;;A1: on the border between Israel and Jordan
		Q2: What is the lowest point on the Earth's surface?;;;A2: The Dead Sea shoreline

        The text is: {{text}}
        """,
        input_variables=["text"],
    )
    return prompt

async def get_generated_text(num_flashcards, file):
    llm = get_llm_model(repo_id="mistralai/Mistral-7B-Instruct-v0.2")
    prompt = get_prompt_template(num_flashcards)
    qa_chain = LLMChain(prompt=prompt, llm=llm)
    text = await asyncio.to_thread(load_document, file)
    answer = await qa_chain.ainvoke({"text": text})
    answer = format_answer(answer['text'], num_flashcards)
    return answer

def format_answer(answer, num_flashcards):
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
