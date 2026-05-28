from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    PATIENT = "patient"
    DOCTOR = "doctor"

    ROLE_CHOICES = [
        (PATIENT, "Patient"),
        (DOCTOR, "Doctor"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"  )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"

    @property
    def is_doctor(self):
        return self.role == self.DOCTOR

    @property
    def is_patient(self):
        return self.role == self.PATIENT

class Notification(models.Model):
    TYPE_CHOICES = [
        ("appointment_sent", "Appointment Sent"),
        ("appointment_approved", "Appointment Approved"),
        ("appointment_rejected", "Appointment Rejected"),
        ("appointment_cancelled", "Appointment Cancelled"),
        ("appointment_completed", "Appointment Completed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message}"