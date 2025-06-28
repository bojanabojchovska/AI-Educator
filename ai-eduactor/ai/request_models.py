from uuid import UUID
from pydantic import BaseModel
from typing import List

class CourseRecommendationRequst(BaseModel):
    taken_courses: List[str]
    remaining_courses: List[str]

class AskQuestionRequest(BaseModel):
    question: str
    pdf_id: str

class Flashcard(BaseModel):
    id: int
    question: str
    answer: str
    courseId: int
    courseTitle: str
    attachmentId: UUID

class RemoveDuplicateFlashCardsRequest(BaseModel):
    flashCards: List[Flashcard]