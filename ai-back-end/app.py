import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from tempfile import NamedTemporaryFile
import uvicorn
from text_generation_utils import get_flashcards, get_recommended_courses
from request_models import CourseRecommendationRequst

app = FastAPI()

@app.post("/")
async def generate_flashcards(file: UploadFile = File(...), num_flashcards: int = Form(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Files must be uploaded only in PDF format.")
    
    with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(await file.read())
        temp_file.flush()
        temp_path = temp_file.name
        question_answer_pairs = await get_flashcards(file=temp_path, num_flashcards=num_flashcards)
    os.remove(temp_path)

    return JSONResponse(content={"question_answer_pairs": question_answer_pairs})

@app.post("/recommend_courses")
async def recommend_courses(request: CourseRecommendationRequst):
    # print("======================")
    # print(request.taken_courses)
    # print(request.remaining_courses)
    # print("======================")
    # recommended_courses = await get_recommended_courses(request)
    return JSONResponse(content={"recommended_courses": ["Course 1", "Course 2", "Course 3"]})


if __name__ == "__main__":
    uvicorn.run("app:app", host="localhost", port=8000, reload=True)