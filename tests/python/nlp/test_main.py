# Test suite for JobNaut NLP Service

import pytest
from fastapi.testclient import TestClient
from src.python.nlp.main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert response.json()["message"] == "JobNaut NLP Service is running"

def test_extract_skills():
    """Test the extract-skills endpoint"""
    test_text = "We are looking for a software engineer with JavaScript, React, and Node.js experience."

    response = client.post("/extract-skills", json={"text": test_text})
    assert response.status_code == 200

    data = response.json()
    assert "skills" in data
    assert isinstance(data["skills"], list)

def test_analyze_job():
    """Test the analyze-job endpoint"""
    job_data = {
        "title": "Software Engineer",
        "description": "We are looking for a software engineer with JavaScript, React, and Node.js experience. Minimum 3 years of experience required.",
        "company": "Tech Corp",
        "location": "San Francisco, CA"
    }

    response = client.post("/analyze-job", json=job_data)
    assert response.status_code == 200

    data = response.json()
    assert "skills" in data
    assert "job_category" in data
    assert "experience_level" in data
    assert isinstance(data["skills"], list)

def test_extract_skills_empty_text():
    """Test extract-skills with empty text"""
    response = client.post("/extract-skills", json={"text": ""})
    assert response.status_code == 200

    data = response.json()
    assert "skills" in data
    assert isinstance(data["skills"], list)

def test_analyze_job_missing_fields():
    """Test analyze-job with missing optional fields"""
    job_data = {
        "title": "Data Scientist",
        "description": "Looking for a data scientist with Python and machine learning experience."
    }

    response = client.post("/analyze-job", json=job_data)
    assert response.status_code == 200

    data = response.json()
    assert "skills" in data
    assert isinstance(data["skills"], list)