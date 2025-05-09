import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from tempfile import NamedTemporaryFile
import uvicorn
from text_generation_utils import get_flashcards, get_recommended_courses
from request_models import CourseRecommendationRequst, AskQuestionRequest
from pinecone_utils import add_file_to_database
from text_generation_utils import get_generated_text

app = FastAPI()

@app.post("/")
async def generate_flashcards(file: UploadFile = File(...), num_flashcards: int = Form(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Files must be uploaded only in PDF format.")
    print(file)
    print(num_flashcards)
    
    # with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
    #     temp_file.write(await file.read())
    #     temp_file.flush()
    #     temp_path = temp_file.name
    #     question_answer_pairs = await get_flashcards(file=temp_path, num_flashcards=num_flashcards)
    # os.remove(temp_path)

    # return JSONResponse(content={"question_answer_pairs": question_answer_pairs})
    return JSONResponse(content={"question_answer_pairs": [{"Question 1": "some question ...1", "Answer 1": "Some answer...1"}, {"Question 2": "some question 2", "Answer 2": "Some answer 2..."}]})

@app.post("/recommend_courses")
async def recommend_courses(request: CourseRecommendationRequst):
    # print("======================")
    # print(request.taken_courses)
    # print(request.remaining_courses)
    # print("======================")
    # recommended_courses = await get_recommended_courses(request)
    return JSONResponse(content={"recommended_courses": ["calculus", "idk?", "discrete Mathematics"]})

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