from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch
import uuid

from users.models import UserProfile
from doctors.models import Doctor
from agents.models import DoctorVerification
from bookings.models import Appointment
from reports.models import Report

class DoctorsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.profile_url = '/api/doctors/profile/'
        self.create_profile_url = '/api/doctors/create-profile/'

        # Setup Patient User
        self.patient_user = User.objects.create_user(username="patient", password="pwd")
        self.patient_user.profile.role="patient"
        self.patient_user.profile.save()

        # Setup Doctor User
        self.doctor_user = User.objects.create_user(username="doctor", password="pwd")
        self.doctor_user.profile.role="doctor"
        self.doctor_user.profile.save()

    def test_create_doctor_profile_success(self):
        self.client.force_authenticate(user=self.doctor_user)
        data = {
            "name": "Dr. Smith",
            "specialization": "Cardiology"
        }
        response = self.client.post(self.create_profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Doctor.objects.filter(user=self.doctor_user).exists())

    def test_create_doctor_profile_unauthorized(self):
        # Patient trying to create doctor profile
        self.client.force_authenticate(user=self.patient_user)
        data = {"name": "Dr. Invalid", "specialization": "None"}
        response = self.client.post(self.create_profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_doctor_profile_get_success(self):
        Doctor.objects.create(user=self.doctor_user, name="Dr. Who", specialization="Time")
        self.client.force_authenticate(user=self.doctor_user)
        
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Dr. Who")

    def test_doctor_profile_not_found(self):
        self.client.force_authenticate(user=self.doctor_user)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('doctors.views.send_approval_email')
    def test_verify_view_approve(self, mock_send_email):
        doctor_profile = Doctor.objects.create(user=self.doctor_user, name="Dr. A", specialization="Gen")
        report = Report.objects.create(user=self.patient_user)
        appointment = Appointment.objects.create(user=self.patient_user, doctor=doctor_profile, report=report)
        verification = DoctorVerification.objects.create(report=report, appointment=appointment)
        
        self.client.force_authenticate(user=self.doctor_user)
        verify_url = f'/api/doctors/verify/{verification.token}/'
        
        data = {"action": "approved"}
        response = self.client.post(verify_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "confirmed")
        
        appointment.refresh_from_db()
        self.assertEqual(appointment.status, "confirmed")
        mock_send_email.assert_called_once()

    def test_verify_view_invalid_action(self):
        doctor_profile = Doctor.objects.create(user=self.doctor_user, name="Dr. A", specialization="Gen")
        report = Report.objects.create(user=self.patient_user)
        appointment = Appointment.objects.create(user=self.patient_user, doctor=doctor_profile, report=report)
        verification = DoctorVerification.objects.create(report=report, appointment=appointment)
        
        self.client.force_authenticate(user=self.doctor_user)
        verify_url = f'/api/doctors/verify/{verification.token}/'
        
        data = {"action": "invalid"}
        response = self.client.post(verify_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
