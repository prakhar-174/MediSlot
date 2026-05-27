from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import UserProfile

class UsersTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.me_url = '/api/auth/me/'
        self.update_email_url = '/api/auth/update-email/'

    def test_register_success(self):
        data = {
            "username": "testuser",
            "password": "testpassword",
            "role": "patient"
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertEqual(response.data["role"], "patient")
        self.assertTrue(User.objects.filter(username="testuser").exists())

    def test_register_missing_fields(self):
        data = {"username": "testuser"}
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_duplicate_username(self):
        User.objects.create_user(username="testuser", password="testpassword")
        data = {
            "username": "testuser",
            "password": "newpassword",
            "role": "patient"
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "username already exists")

    def test_login_success(self):
        user = User.objects.create_user(username="testuser", password="testpassword")
        user.profile.role="patient"
        user.profile.save()
        
        data = {"username": "testuser", "password": "testpassword"}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertEqual(response.data["role"], "patient")

    def test_login_invalid_credentials(self):
        data = {"username": "wrong", "password": "wrong"}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_authenticated(self):
        user = User.objects.create_user(username="testuser", password="testpassword")
        user.profile.role="patient"
        user.profile.save()
        self.client.force_authenticate(user=user)
        
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testuser")
        self.assertEqual(response.data["role"], "patient")

    def test_me_unauthenticated(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_email_success(self):
        user = User.objects.create_user(username="testuser", password="testpassword")
        profile = user.profile
        profile.role="patient"
        profile.save()
        self.client.force_authenticate(user=user)
        
        data = {"email": "test@example.com"}
        response = self.client.post(self.update_email_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        profile.refresh_from_db()
        self.assertEqual(profile.email, "test@example.com")

    def test_update_email_missing(self):
        user = User.objects.create_user(username="testuser", password="testpassword")
        user.profile.role="patient"
        user.profile.save()
        self.client.force_authenticate(user=user)
        
        response = self.client.post(self.update_email_url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
