from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch
from django.core.files.uploadedfile import SimpleUploadedFile

from users.models import UserProfile
from reports.models import Report

class ReportsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.upload_url = '/api/reports/upload/'
        self.list_url = '/api/reports/'

        # Setup Patient User
        self.patient_user = User.objects.create_user(username="patient", password="pwd")
        self.patient_user.profile.role="patient"
        self.patient_user.profile.save()

    @patch('reports.views.extract_text_from_pdf')
    @patch('reports.views.run_orchestrator')
    def test_upload_report_success(self, mock_run_orchestrator, mock_extract_text):
        mock_extract_text.return_value = "Mocked PDF text"
        mock_run_orchestrator.return_value = {"summary": "Healthy"}
        
        self.client.force_authenticate(user=self.patient_user)
        
        file_content = b'dummy pdf content'
        uploaded_file = SimpleUploadedFile("test_report.pdf", file_content, content_type="application/pdf")
        
        data = {"file": uploaded_file}
        response = self.client.post(self.upload_url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("report_id", response.data)
        self.assertEqual(response.data["analysis"], {"summary": "Healthy"})
        
        report = Report.objects.get(id=response.data["report_id"])
        self.assertEqual(report.extracted_text, "Mocked PDF text")

    def test_upload_report_missing_file(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.post(self.upload_url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_report_list(self):
        Report.objects.create(user=self.patient_user, analysis={"test": "data"})
        self.client.force_authenticate(user=self.patient_user)
        
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
