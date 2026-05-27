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

    def __str__(self):
        return f"{self.user.username} ({self.role})"

    @property
    def is_doctor(self):
        return self.role == self.DOCTOR

    @property
    def is_patient(self):
        return self.role == self.PATIENT