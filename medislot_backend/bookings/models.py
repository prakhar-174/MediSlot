from django.db import models
from django.contrib.auth.models import User
from doctors.models import Doctor
from reports.models import Report

class Appointment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    report = models.ForeignKey(Report, on_delete=models.CASCADE, null=True, blank=True)
    
    date = models.DateField(null=True, blank=True)
    time_slot = models.CharField(max_length=50, null=True, blank=True)
    reason = models.TextField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ("pending","Pending"),
            ("approved","Approved"),
            ("rejected","Rejected"),
            ("completed","Completed"),
            ("cancelled","Cancelled")
        ],
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.status}"