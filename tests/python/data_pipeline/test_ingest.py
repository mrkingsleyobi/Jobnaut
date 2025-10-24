# Test suite for JobNaut Data Ingestion Pipeline

import pytest
import sys
import os
from unittest.mock import patch, MagicMock

# Add parent directory to path to import ingest module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.python.data_pipeline.ingest import DataIngestionPipeline

@pytest.fixture
def pipeline():
    """Create a DataIngestionPipeline instance for testing"""
    return DataIngestionPipeline()

def test_pipeline_initialization():
    """Test that the pipeline initializes correctly"""
    pipeline = DataIngestionPipeline()

    # Check that configuration attributes are set
    assert hasattr(pipeline, 'jsearch_api_key')
    assert hasattr(pipeline, 'jsearch_api_url')
    assert hasattr(pipeline, 'meilisearch_host')
    assert hasattr(pipeline, 'nlp_service_url')

def test_prepare_job_for_indexing():
    """Test preparing job data for indexing"""
    pipeline = DataIngestionPipeline()

    # Mock job data
    job_data = {
        'job_id': '123',
        'job_title': 'Software Engineer',
        'employer_name': 'Tech Corp',
        'job_city': 'San Francisco',
        'job_state': 'CA',
        'job_description': 'Exciting opportunity for a software engineer...',
        'job_posted_at_datetime_utc': '2023-01-01T00:00:00Z',
        'job_apply_link': 'https://example.com/apply'
    }

    # Mock the NLP processing
    with patch.object(pipeline, 'process_job_with_nlp', return_value=['JavaScript', 'React']):
        result = pipeline.prepare_job_for_indexing(job_data)

        assert result is not None
        assert result['id'] == '123'
        assert result['title'] == 'Software Engineer'
        assert result['company'] == 'Tech Corp'
        assert result['location'] == 'San Francisco, CA'
        assert result['skills'] == ['JavaScript', 'React']
        assert result['source'] == 'jsearch'

def test_process_job_with_nlp():
    """Test processing job with NLP"""
    pipeline = DataIngestionPipeline()

    job_text = "We are looking for a software engineer with JavaScript and React experience."

    # In the actual implementation, this would call the NLP service
    # For testing, we'll just check that it returns a list
    result = pipeline.process_job_with_nlp(job_text)
    assert isinstance(result, list)

def test_fetch_jobs_from_jsearch():
    """Test fetching jobs from JSearch API"""
    pipeline = DataIngestionPipeline()

    # Mock the requests.get call
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        'data': [
            {
                'job_id': '123',
                'job_title': 'Software Engineer',
                'employer_name': 'Tech Corp'
            }
        ]
    }

    with patch('requests.get', return_value=mock_response):
        result = pipeline.fetch_jobs_from_jsearch('software engineer', 1)

        assert isinstance(result, list)
        assert len(result) == 1
        assert result[0]['job_id'] == '123'

def test_fetch_jobs_from_jsearch_error():
    """Test error handling when fetching jobs from JSearch API"""
    pipeline = DataIngestionPipeline()

    # Mock a request exception
    with patch('requests.get', side_effect=Exception('API Error')):
        result = pipeline.fetch_jobs_from_jsearch('software engineer', 1)

        # Should return empty list on error
        assert isinstance(result, list)
        assert len(result) == 0