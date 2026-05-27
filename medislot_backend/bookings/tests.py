from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from users.models import UserProfile
from doctors.models import Doctor
from reports.models import Report
from bookings.models import Appointment

class BookingsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.prebook_url = '/api/bookings/prebook/'
        self.list_url = '/api/bookings/'

        # Setup Patient User
        self.patient_user = User.objects.create_user(username="patient", password="pwd")
        self.patient_profile = self.patient_user.profile
        self.patient_profile.role="patient"
        self.patient_profile.email="patient@example.com"
        self.patient_profile.save()

        # Setup Doctor User and Profile
        self.doctor_user = User.objects.create_user(username="doctor", password="pwd")
        self.doctor_profile = Doctor.objects.create(user=self.doctor_user, name="Dr. B", specialization="Neuro")

        # Setup Report
        self.report = Report.objects.create(user=self.patient_user)

    def test_prebook_success(self):
        self.client.force_authenticate(user=self.patient_user)
        data = {
            "doctor_id": self.doctor_profile.id,
            "report_id": self.report.id
        }
        response = self.client.post(self.prebook_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("appointment_id", response.data)
        self.assertEqual(response.data["status"], "pending")
        self.assertTrue(Appointment.objects.filter(user=self.patient_user).exists())

    def test_prebook_missing_email(self):
        self.patient_profile.email = ""
        self.patient_profile.save()
        self.client.force_authenticate(user=self.patient_user)
        
        data = {
            "doctor_id": self.doctor_profile.id,
            "report_id": self.report.id
        }
        response = self.client.post(self.prebook_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Please add email before booking")

    def test_prebook_missing_ids(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.post(self.prebook_url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_appointment_list(self):
        Appointment.objects.create(user=self.patient_user, doctor=self.doctor_profile, report=self.report)
        self.client.force_authenticate(user=self.patient_user)
        
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["doctor_name"], "Dr. B")
