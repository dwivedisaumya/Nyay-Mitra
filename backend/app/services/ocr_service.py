import io
import os
from google import genai
from google.genai import types
from pypdf import PdfReader
from docx import Document

class OCRService:
    def __init__(self):
        # Initialize the client using the modern google-genai SDK
        api_key = os.getenv("GEMINI_API_KEY")
        self.client = genai.Client(api_key=api_key)
        # 2.0-flash is optimal for high-accuracy OCR and vision tasks
        self.model_id = "gemini-2.0-flash-lite"

    async def extract_text(self, content: bytes, filename: str) -> str:
        ext = filename.split('.')[-1].lower()
        
        # 1. Image OCR (PNG, JPG, JPEG)
        if ext in ['png', 'jpg', 'jpeg']:
            try:
                # Specialized prompt for legal context
                prompt = (
                    "You are a specialized legal document reader. Extract all text from this document. "
                    "Maintain the structure (tables, headers, bullet points). "
                    "Identify and transcribe any HANDWRITTEN notes, stamps, or signatures separately at the end. "
                    "Return ONLY the plain text of the document."
                )
                
                response = self.client.models.generate_content(
                    model=self.model_id,
                    contents=[
                        prompt,
                        types.Part.from_bytes(
                            data=content, 
                            mime_type=f"image/{ext}"
                        )
                    ]
                )
                return response.text if response.text else ""
            except Exception as e:
                print(f"Image OCR Error: {e}")
                return ""
            
        # 2. PDF Extraction (Digital & Scanned)
        elif ext == 'pdf':
            try:
                # Attempt standard digital extraction first
                pdf_stream = io.BytesIO(content)
                reader = PdfReader(pdf_stream)
                text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
                
                # FALLBACK: If digital extraction yields almost no text, use Gemini Vision
                if len(text.strip()) < 50:
                    print(f"PDF {filename} appears to be scanned. Falling back to Gemini Vision...")
                    response = self.client.models.generate_content(
                        model=self.model_id,
                        contents=[
                            "OCR this scanned PDF. Extract all text exactly as written, preserving layout.",
                            types.Part.from_bytes(data=content, mime_type="application/pdf")
                        ]
                    )
                    return response.text if response.text else ""
                return text
            except Exception as e:
                print(f"PDF Extraction Error: {e}")
                return ""
            
        # 3. DOCX Extraction
        elif ext == 'docx':
            try:
                doc_stream = io.BytesIO(content)
                doc = Document(doc_stream)
                return "\n".join([para.text for para in doc.paragraphs])
            except Exception as e:
                print(f"DOCX Extraction Error: {e}")
                return ""
            
        return ""