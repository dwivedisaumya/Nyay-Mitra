import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List

# 1. Internal Schema: Aligned perfectly with DocumentAnalysisResponse
class LegalAnalysis(BaseModel):
    # English Fields
    simplified_summary: str = Field(description="A concise abstract in English.")
    roadmap: List[str] = Field(description="Step-by-step actions in English.")
    rights_and_warnings: str = Field(description="Legal rights/warnings in English as a single string.")
    
    # Hindi Fields (हिन्दी)
    simplified_summary_hi: str = Field(description="Summary in simple Hindi (हिन्दी).")
    roadmap_hi: List[str] = Field(description="Step-by-step roadmap in Hindi (हिन्दी).")
    rights_and_warnings_hi: str = Field(description="Legal rights in Hindi as a single string.")

class LegalService:
    def __init__(self):
        # Initialize client
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        # Using 2.0 Flash for speed and bilingual accuracy
        self.model_id = "gemini-2.0-flash-lite" 
        
        self.system_instruction = (
            "You are NyayMitra, an expert Legal AI for Indian Law. "
            "Analyze legal documents and provide a BILINGUAL analysis. "
            "For Hindi (हिन्दी), use 'Sahaj Hindi' (Simple Hindi). "
            "Avoid complex Sanskrit terms. Be helpful and reassuring. "
            "IMPORTANT: 'rights_and_warnings' and 'rights_and_warnings_hi' must be STRINGS, not lists."
        )

    async def simplify_document(self, raw_text: str) -> str:
        prompt = f"Analyze and simplify this legal document for a common citizen:\n\n{raw_text}"
        
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=self.system_instruction,
                    response_mime_type="application/json",
                    response_json_schema=LegalAnalysis.model_json_schema()
                )
            )
            return response.text
            
        except Exception as e:
            print(f"Bilingual Analysis Error: {e}")
            # Fallback JSON matches the schema exactly to prevent FastAPI validation errors
            fallback = {
                "simplified_summary": "Error analyzing document.",
                "simplified_summary_hi": "दस्तावेज़ विश्लेषण में त्रुटि।",
                "roadmap": ["Please try again later."],
                "roadmap_hi": ["कृपया बाद में पुनः प्रयास करें।"],
                "rights_and_warnings": "Service temporarily unavailable.",
                "rights_and_warnings_hi": "सेवा अस्थायी रूप से अनुपलब्ध है।"
            }
            return json.dumps(fallback)