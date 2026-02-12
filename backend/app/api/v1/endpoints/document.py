from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services.document_service import DocumentService
from app.models.document import DocumentAnalysisResponse
from datetime import datetime

router = APIRouter()
doc_service = DocumentService()

@router.post("/process", response_model=DocumentAnalysisResponse)
async def process_legal_document(file: UploadFile = File(...)):
    # 1. Validation of file extension
    allowed_extensions = {"pdf", "docx", "png", "jpg", "jpeg"}
    file_ext = file.filename.split(".")[-1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Unsupported format. Please upload: {', '.join(allowed_extensions)}"
        )

    try:
        # Read the file into memory
        content = await file.read()
        
        # 2. Call the Document Service
        # It now returns the bilingual data (EN/HI)
        result = await doc_service.process_legal_document(content, file.filename)
        
        return result

    except Exception as e:
        # 3. Fallback Safety: Catching Quota (429) or Logic Errors
        # If the service fails, we return a valid DocumentAnalysisResponse object
        # to prevent a 'ResponseValidationError'.
        print(f"CRITICAL ERROR: {str(e)}")
        
        error_detail = "AI Quota exceeded. Please wait 1 minute." if "429" in str(e) else "Internal Analysis Error."
        
        return DocumentAnalysisResponse(
            id=0,
            filename=file.filename,
            upload_date=datetime.now(),
            raw_text_preview="Error: Analysis could not be completed.",
            simplified_summary="The analysis failed due to high server load.",
            simplified_summary_hi="सर्वर पर अधिक लोड होने के कारण विश्लेषण विफल रहा।",
            roadmap=["Please refresh and try again later."],
            roadmap_hi=["कृपया बाद में पुनः प्रयास करें।"],
            rights_and_warnings=error_detail,
            rights_and_warnings_hi="सेवा अस्थायी रूप से अनुपलब्ध है।",
            language="Error"
        )