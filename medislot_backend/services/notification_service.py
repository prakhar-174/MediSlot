from django.core.mail import send_mail
from django.conf import settings
from utils.email_utils import get_user_email


def send_approval_email(user, status):
    email = get_user_email(user)

    if not email:
        return

    subject = "Appointment Status Update"

    message = f"""
Hello {user.username},

Your appointment has been {status}.

Thank you,
Aarogya Team
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False
    )