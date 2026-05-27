from django.db import models
from django.contrib.auth.models import User


class Doctor(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,            # TEMP
        blank=True,
        related_name='doctor_profile',
    )
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    rating = models.FloatField(default=4.5)

    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)  # TEMP