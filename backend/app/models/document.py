from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# 1. Output Schema: The exact structure the Frontend expects
class DocumentAnalysisResponse(BaseModel):
    id: Optional[int] = None
    filename: str = Field(..., example="court_notice.pdf")
    upload_date: datetime = Field(default_factory=datetime.now)
    
    # Metadata
    raw_text_preview: str = Field(..., description="First 500 characters of OCR text")
    language: str = Field(default="Bilingual (EN/HI)")

    # English Content (Strictly strings and lists as defined)
    simplified_summary: str = Field(..., description="The Gemini-generated summary in English")
    roadmap: List[str] = Field(..., description="Step-by-step actions in English")
    rights_and_warnings: str = Field(..., description="Legal rights in English")

    # Hindi Content (हिन्दी)
    simplified_summary_hi: str = Field(..., description="The Gemini-generated summary in Hindi")
    roadmap_hi: List[str] = Field(..., description="Step-by-step actions in Hindi")
    rights_and_warnings_hi: str = Field(..., description="Legal rights in Hindi")

# 2. Status Schema: For asynchronous tracking
class ProcessingStatus(BaseModel):
    task_id: str
    status: str # e.g., "processing", "completed", "failed"
    progress: int = 0  # 0 to 100 percentage

# 3. Request Schema: For interactive Q&A
class DocumentQuestionRequest(BaseModel):
    document_id: int
    question: str = Field(..., example="What is the deadline for filing the response?")
    lang_preference: str = Field(default="en", description="Language for the answer ('en' or 'hi')")