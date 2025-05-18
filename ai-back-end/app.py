import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from tempfile import NamedTemporaryFile
import uvicorn
from text_generation_utils import get_flashcards, get_recommended_courses
from request_models import CourseRecommendationRequst, AskQuestionRequest, RemoveDuplicateFlashCardsRequest, Flashcard
from pinecone_utils import add_file_to_database
from text_generation_utils import get_generated_text
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/")
async def generate_flashcards(file: UploadFile = File(...), num_flashcards: int = Form(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Files must be uploaded only in PDF format.")
    print(file)
    print(num_flashcards)
    
    with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(await file.read())
        temp_file.flush()
        temp_path = temp_file.name
        question_answer_pairs = await get_flashcards(file=temp_path, num_flashcards=num_flashcards)
    os.remove(temp_path)

    return JSONResponse(content={"question_answer_pairs": question_answer_pairs})
    # return JSONResponse(content={"question_answer_pairs": [{"Question 1": "some question ...1", "Answer 1": "Some answer...1"}, {"Question 2": "some question 2", "Answer 2": "Some answer 2..."}]})

@app.post("/recommend_courses")
async def recommend_courses(request: CourseRecommendationRequst):
    # print("======================")
    # print(request.taken_courses)
    # print(request.remaining_courses)
    # print("======================")
    recommended_courses = await get_recommended_courses(request)
    return JSONResponse(content={"recommended_courses": recommended_courses})

@app.post("/upload_file")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Files must be uploaded only in PDF format.")
    
    with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(await file.read())
        temp_file.flush()
        temp_path = temp_file.name
        pdf_id = await add_file_to_database(file=temp_path)
    os.remove(temp_path)

    return JSONResponse(content={"Id": pdf_id})

@app.post("/ask")
async def ask_question(request: AskQuestionRequest):
    question = request.question
    pdf_id = request.pdf_id
    answer = get_generated_text(query=question, pdf_id=pdf_id, k=3)
    return JSONResponse(content={"Question": question, "Answer":answer})

if __name__ == "__main__":
    uvicorn.run("app:app", host="localhost", port=8000, reload=True)


@app.post("/remove-duplicates")
async def remove_duplicates(request: RemoveDuplicateFlashCardsRequest):
    model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
    def compute_similarity(card1: Flashcard, card2: Flashcard) -> float:
        text1 = card1.question + " " + card1.answer
        text2 = card2.question + " " + card2.answer

        embeddings1 = model.encode([text1])
        embeddings2 = model.encode([text2])

        similarity = cosine_similarity(embeddings1, embeddings2)
        return similarity[0][0]

    unique_flashcards = []

    for card in request.flashCards:
        is_duplicate = False
        for unique_card in unique_flashcards:
            similarity = compute_similarity(card, unique_card)
            if similarity > 0.85: 
                is_duplicate = True
                break
        if not is_duplicate:
            unique_flashcards.append(card)

    return {"cleaned_flashcards": unique_flashcards}