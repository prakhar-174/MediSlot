from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch

from users.models import UserProfile
from symptoms.models import ChatSession, ChatMessage
from reports.models import Report

class SymptomsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.chat_url = '/api/symptoms/chat/'

        # Setup Patient User
        self.patient_user = User.objects.create_user(username="patient", password="pwd")
        self.patient_user.profile.role="patient"
        self.patient_user.profile.save()

    @patch('symptoms.views.chat_ai')
    def test_chatbot_new_session(self, mock_chat_ai):
        mock_chat_ai.return_value = "Mocked response"
        self.client.force_authenticate(user=self.patient_user)
        
        data = {"message": "Hello"}
        response = self.client.post(self.chat_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("session_id", response.data)
        self.assertEqual(response.data["reply"], "Mocked response")
        
        session_id = response.data["session_id"]
        self.assertTrue(ChatSession.objects.filter(id=session_id).exists())
        self.assertTrue(ChatMessage.objects.filter(session_id=session_id).exists())

    @patch('symptoms.views.chat_ai')
    def test_chatbot_existing_session(self, mock_chat_ai):
        mock_chat_ai.return_value = "Second mocked response"
        session = ChatSession.objects.create(user=self.patient_user)
        self.client.force_authenticate(user=self.patient_user)
        
        data = {
            "message": "Next message",
            "session_id": session.id
        }
        response = self.client.post(self.chat_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["session_id"], session.id)
        self.assertEqual(response.data["reply"], "Second mocked response")
        self.assertEqual(ChatMessage.objects.filter(session=session).count(), 1)

    def test_chatbot_missing_message(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.post(self.chat_url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_chatbot_invalid_session(self):
        self.client.force_authenticate(user=self.patient_user)
        data = {
            "message": "Hello",
            "session_id": 999
        }
        response = self.client.post(self.chat_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Invalid session")
