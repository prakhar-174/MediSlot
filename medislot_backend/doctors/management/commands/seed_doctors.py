from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction
from doctors.models import Doctor
from users.models import UserProfile
import random


class Command(BaseCommand):
    help = "Reset and seed 50 doctors with same password (idempotent)"

    def handle(self, *args, **kwargs):
        PASSWORD = "doctor123"

        specializations = [
            "Cardiologist",
            "Dermatologist",
            "Endocrinologist",
            "Neurologist",
            "Orthopedic",
            "Pediatrician",
            "Psychiatrist",
            "General Physician"
        ]

        names = [
            "Amit Sharma", "Rohit Verma", "Karan Singh", "Ankit Gupta",
            "Rahul Mehta", "Vikas Jain", "Sandeep Kumar", "Nikhil Agarwal",
            "Arjun Yadav", "Manish Tiwari", "Deepak Mishra", "Pankaj Saxena",
            "Abhishek Singh", "Harsh Vardhan", "Yash Sharma", "Aditya Verma",
            "Varun Khanna", "Mohit Gupta", "Shubham Jain", "Rajat Sharma"
        ]

        with transaction.atomic():
            Doctor.objects.all().delete()

            for i in range(1, 51):
                username = f"doctor{i}"

                user, _ = User.objects.get_or_create(username=username)
                user.set_password(PASSWORD)
                user.save()

                profile, _ = UserProfile.objects.get_or_create(user=user)
                profile.role = UserProfile.DOCTOR
                profile.save()

                base_name = random.choice(names)

                Doctor.objects.update_or_create(
                    user=user,
                    defaults={
                        "name": f"Dr. {base_name}",
                        "specialization": random.choice(specializations),
                        "rating": round(random.uniform(3.5, 5.0), 1),
                        "is_verified": True
                    }
                )

        self.stdout.write(self.style.SUCCESS("✅ 50 doctors seeded successfully"))
        self.stdout.write(self.style.WARNING(f"🔑 Password for all: {PASSWORD}"))