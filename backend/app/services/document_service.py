import os
import json
import asyncio
from datetime import datetime
from google import genai
from google.genai import types

class DocumentService:
    def __init__(self):
        # We use the standard client, but will access .aio for async calls
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model_id = "gemini-2.0-flash-lite"
        self.backup_model_id = "gemini-1.5-flash"

    def _get_mime_type(self, ext: str) -> str:
        mapping = {
            'pdf': 'application/pdf', 
            'png': 'image/png', 
            'jpg': 'image/jpeg', 
            'jpeg': 'image/jpeg'
        }
        return mapping.get(ext, 'application/octet-stream')

    async def _call_gemini_async(self, model, prompt, content, ext):
        """Native async call using the SDK's aio interface"""
        # Note the use of self.client.aio here
        return await self.client.aio.models.generate_content(
            model=model,
            contents=[
                prompt,
                types.Part.from_bytes(data=content, mime_type=self._get_mime_type(ext))
            ],
            config=types.GenerateContentConfig(
                system_instruction="You are NyayMitra, a legal assistant. You only output valid JSON.",
                response_mime_type="application/json"
            )
        )

    async def process_legal_document(self, content: bytes, filename: str):
        ext = filename.split('.')[-1].lower()
        
        # ⏱️ COOL DOWN: Wait to clear RPM (Requests Per Minute)
        print(f"Demo Mode: Cooling down for 15 seconds to avoid 429 errors...")
        await asyncio.sleep(15)

        prompt = (
            "Analyze this legal document. Provide a comprehensive bilingual analysis. "
            "Output MUST be a JSON object with these keys: "
            "{ 'simplified_summary': '...', 'simplified_summary_hi': '...', "
            "  'roadmap': ['step1', 'step2'], 'roadmap_hi': ['चरण1', 'चरण2'], "
            "  'rights_and_warnings': '...', 'rights_and_warnings_hi': '...' }"
        )

        try:
            # 1. Attempt with Primary Model (Native Async)
            response = await self._call_gemini_async(self.model_id, prompt, content, ext)
            analysis_data = json.loads(response.text)
            
        except Exception as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                print(f"Primary model {self.model_id} exhausted. Trying backup {self.backup_model_id}...")
                await asyncio.sleep(5) 
                try:
                    # 2. Attempt with Backup Model (Native Async)
                    response = await self._call_gemini_async(self.backup_model_id, prompt, content, ext)
                    analysis_data = json.loads(response.text)
                except Exception as inner_e:
                    return self._get_fallback_response(filename, inner_e)
            else:
                return self._get_fallback_response(filename, e)

        return self._format_response(filename, analysis_data)

    def _format_response(self, filename, data):
        return {
            "id": 1,
            "filename": filename,
            "upload_date": datetime.now().isoformat(),
            "raw_text_preview": "Analysis Successful",
            "language": "Bilingual (EN/HI)",
            "simplified_summary": data.get("simplified_summary", "N/A"),
            "roadmap": data.get("roadmap", []),
            "rights_and_warnings": data.get("rights_and_warnings", "N/A"),
            "simplified_summary_hi": data.get("simplified_summary_hi", "N/A"),
            "roadmap_hi": data.get("roadmap_hi", []),
            "rights_and_warnings_hi": data.get("rights_and_warnings_hi", "N/A"),
        }

    def _get_fallback_response(self, filename, error):
        error_msg = str(error)
        if "429" in error_msg:
            error_msg = "Daily Quota Reached. Reset at 1:30 PM IST."
            
        return {
            "id": 0,
            "filename": filename,
            "upload_date": datetime.now().isoformat(),
            "raw_text_preview": "Error",
            "language": "Bilingual",
            "simplified_summary": "API Limit Reached.",
            "simplified_summary_hi": "API सीमा समाप्त हो गई है।",
            "roadmap": ["Wait for 60 seconds or use a new API key."],
            "roadmap_hi": ["60 सेकंड प्रतीक्षा करें या नई कुंजी का उपयोग करें।"],
            "rights_and_warnings": error_msg,
            "rights_and_warnings_hi": "सेवा अभी उपलब्ध नहीं है।"
        }