from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404

from bookings.models import Appointment
from utils.permissions import IsDoctor, IsPatient

from .models import DoctorVerification, PromptConfig


class ShareView(APIView):
    """Patient shares their report with a doctor via a one-time token."""
    permission_classes = [IsPatient]

    def post(self, request, appointment_id):
        appointment = get_object_or_404(Appointment, id=appointment_id, user=request.user)

        verification = DoctorVerification.objects.create(
            report=appointment.report,
            appointment=appointment,
        )

        return Response({"token": str(verification.token)})


class VerifyView(APIView):
    permission_classes = [IsDoctor]

    def post(self, request, token):
        verification = get_object_or_404(DoctorVerification, token=token)

        action = request.data.get("action")
        if action not in ("approved", "rejected"):
            return Response(
                {"error": "action must be 'approved' or 'rejected'"},
                status=400,
            )

        verification.status = action
        verification.save()

        appointment = verification.appointment
        appointment.status = "confirmed" if action == "approved" else "cancelled"
        appointment.save()

        return Response({"status": appointment.status})


class PendingVerificationsView(APIView):
    permission_classes = [IsDoctor]

    def get(self, request):
        verifications = DoctorVerification.objects.filter(
            appointment__doctor__user=request.user,
            status="pending"
        ).select_related('report', 'appointment', 'appointment__user')
        
        data = []
        for v in verifications:
            data.append({
                "token": str(v.token),
                "status": v.status,
                "appointment_id": v.appointment.id,
                "patient_name": v.appointment.user.username,
                "report_id": v.report.id,
                "report_file": v.report.file.url if v.report.file else None,
                "report_text": v.report.extracted_text,
                "report_analysis": v.report.analysis,
                "created_at": v.appointment.created_at
            })
            
        return Response(data)

class PromptConfigListView(APIView):
    """Public: list all prompt config names."""
    permission_classes = [AllowAny]

    def get(self, request):
        configs = PromptConfig.objects.all().values('name', 'updated_at')
        return Response(list(configs))


class PromptConfigDetailView(APIView):
    """Public: get or update a prompt config by name."""
    permission_classes = [AllowAny]

    def get(self, request, name):
        config = get_object_or_404(PromptConfig, name=name)
        return Response({'name': config.name, 'content': config.content, 'updated_at': config.updated_at})

    def put(self, request, name):
        content = request.data.get('content', '')
        config, _ = PromptConfig.objects.update_or_create(
            name=name,
            defaults={'content': content}
        )
        return Response({'name': config.name, 'content': config.content, 'updated_at': config.updated_at})
