from django.db import models
import uuid
from reports.models import Report
from bookings.models import Appointment

class DoctorVerification(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)

    token = models.UUIDField(default=uuid.uuid4, unique=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ("pending","Pending"),
            ("approved","Approved"),
            ("rejected","Rejected")
        ],
        default="pending"
    )
from django.db import models


class PromptConfig(models.Model):
    name = models.CharField(max_length=100, unique=True)
    content = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name