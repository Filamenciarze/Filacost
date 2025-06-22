import requests
from accounts.celery import shared_task
from django.conf import settings
from accounts.models import DockerProcessingJob
import os

SLICER_URL = getattr(settings, "SLICER_API_URL", "https://slicer-service/slice")

@shared_task(bind=True)
def send_file_to_docker_task(self, job_id):
    """
    A Celery task that sends a file to the FastAPI slicer service via HTTP.
    """
    try:
        job = DockerProcessingJob.objects.get(id=job_id)

        # Open the file stored by Django in binary read mode
        with job.input_file.open('rb') as f:
            # The key 'stl_file' must match the argument name in your FastAPI endpoint
            files_payload = {'stl_file': (os.path.basename(job.input_file.name), f, 'application/octet-stream')}
            
            # Make the POST request to the FastAPI container
            response = requests.post(SLICER_URL, files=files_payload, timeout=300) # 5-minute timeout

            # This will raise an exception for HTTP error codes (4xx or 5xx)
            response.raise_for_status()

            # The response from FastAPI is JSON, so we parse it
            result_json = response.json()

            # Update the job as completed
            # We convert the JSON to a string to store it in the TextField
            job.mark_completed(response_text=str(result_json))

    except DockerProcessingJob.DoesNotExist:
        return "Job not found."
    except requests.exceptions.RequestException as e:
        # Handle network errors (connection refused, timeout, DNS error, etc.)
        job.mark_failed(error_msg=f"Network Error: {e}")
        raise self.retry(exc=e, countdown=60) # Optionally retry after 1 minute
    except Exception as e:
        # Handle other potential errors (e.g., JSON parsing)
        job.mark_failed(error_msg=str(e))
        raise e