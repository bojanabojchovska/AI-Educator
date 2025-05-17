from pydantic import BaseModel
from typing import List

class CourseRecommendationRequst(BaseModel):
    taken_courses: List[str]
    remaining_courses: List[str]

class AskQuestionRequest(BaseModel):
    question: str
    pdf_id: str