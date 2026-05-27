from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from users.models import UserProfile
from doctors.models import Doctor
from reports.models import Report
from bookings.models import Appointment
from agents.models import DoctorVerification

class AgentsTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Setup Patient User
        self.patient_user = User.objects.create_user(username="patient", password="pwd")
        self.patient_user.profile.role="patient"
        self.patient_user.profile.save()

        # Setup Doctor User
        self.doctor_user = User.objects.create_user(username="doctor", password="pwd")
        self.doctor_user.profile.role="doctor"
        self.doctor_user.profile.save()
        self.doctor_profile = Doctor.objects.create(user=self.doctor_user, name="Dr. X", specialization="Gen")

        # Setup Report and Appointment
        self.report = Report.objects.create(user=self.patient_user, extracted_text="Some text")
        self.appointment = Appointment.objects.create(user=self.patient_user, doctor=self.doctor_profile, report=self.report)

    def test_share_view_success(self):
        self.client.force_authenticate(user=self.patient_user)
        share_url = f'/api/share/{self.appointment.id}/'
        
        response = self.client.post(share_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        
        # Verify it was created
        self.assertTrue(DoctorVerification.objects.filter(appointment=self.appointment).exists())

    def test_verify_view_approve(self):
        verification = DoctorVerification.objects.create(report=self.report, appointment=self.appointment)
        
        self.client.force_authenticate(user=self.doctor_user)
        verify_url = f'/api/verify/{verification.token}/'
        
        data = {"action": "approved"}
        response = self.client.post(verify_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "confirmed")
        
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.status, "confirmed")

    def test_verify_view_invalid_action(self):
        verification = DoctorVerification.objects.create(report=self.report, appointment=self.appointment)
        
        self.client.force_authenticate(user=self.doctor_user)
        verify_url = f'/api/verify/{verification.token}/'
        
        data = {"action": "something_else"}
        response = self.client.post(verify_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_pending_verifications_list(self):
        DoctorVerification.objects.create(report=self.report, appointment=self.appointment)
        
        self.client.force_authenticate(user=self.doctor_user)
        pending_url = '/api/pending/'
        
        response = self.client.get(pending_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["patient_name"], "patient")
