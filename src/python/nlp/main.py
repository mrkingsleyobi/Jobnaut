# JobNaut NLP Service
# FastAPI application for NLP processing of job descriptions

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import requests
import json
import os

# Initialize FastAPI app
app = FastAPI(
    title="JobNaut NLP Service",
    description="NLP service for processing job descriptions and extracting skills",
    version="1.0.0"
)

# Hugging Face configuration
HUGGING_FACE_API_KEY = os.getenv("HUGGING_FACE_API_KEY", "YOUR_HUGGING_FACE_API_KEY")
HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models"

class TextRequest(BaseModel):
    text: str

class SkillsResponse(BaseModel):
    skills: List[str]
    confidence_scores: Optional[dict] = None

class JobDescriptionRequest(BaseModel):
    title: str
    description: str
    company: Optional[str] = None
    location: Optional[str] = None

class JobAnalysisResponse(BaseModel):
    skills: List[str]
    job_category: Optional[str] = None
    experience_level: Optional[str] = None
    confidence_scores: Optional[dict] = None

def extract_skills_with_hugging_face(text: str) -> List[str]:
    """
    Extract skills from text using Hugging Face transformers
    """
    # In a real implementation, this would call the Hugging Face API
    # For now, we'll return mock skills
    mock_skills = ["JavaScript", "React", "Node.js", "Python", "SQL"]
    return mock_skills

def classify_job_category(text: str) -> str:
    """
    Classify job category using NLP
    """
    # In a real implementation, this would use a classification model
    # For now, we'll return a mock category
    return "Software Engineering"

def determine_experience_level(text: str) -> str:
    """
    Determine experience level from job description
    """
    # In a real implementation, this would analyze the text for experience requirements
    # For now, we'll return a mock level
    return "Mid-level"

@app.get("/")
async def root():
    return {"message": "JobNaut NLP Service is running"}

@app.post("/extract-skills", response_model=SkillsResponse)
async def extract_skills(request: TextRequest):
    """
    Extract skills from text
    """
    try:
        skills = extract_skills_with_hugging_face(request.text)
        return SkillsResponse(skills=skills)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting skills: {str(e)}")

@app.post("/analyze-job", response_model=JobAnalysisResponse)
async def analyze_job(request: JobDescriptionRequest):
    """
    Analyze job description and extract skills, category, and experience level
    """
    try:
        # Combine title and description for analysis
        full_text = f"{request.title}. {request.description}"

        # Extract skills
        skills = extract_skills_with_hugging_face(full_text)

        # Classify job category
        category = classify_job_category(full_text)

        # Determine experience level
        experience = determine_experience_level(full_text)

        return JobAnalysisResponse(
            skills=skills,
            job_category=category,
            experience_level=experience
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing job: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)