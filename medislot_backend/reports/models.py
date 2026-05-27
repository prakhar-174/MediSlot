from django.db import models
from django.contrib.auth.models import User

class Report(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    analysis = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to="reports/", null=True, blank=True)
    extracted_text = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Report {self.id} - {self.user}"