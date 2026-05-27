from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from agents.models import DoctorVerification
from bookings.models import Appointment
from utils.permissions import IsDoctor

from .models import Doctor


class DoctorProfileView(APIView):

    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        try:
            doctor = Doctor.objects.get(user=request.user)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor profile not found."}, status=404)

        return Response({
            "id": doctor.id,
            "name": doctor.name,
            "specialization": doctor.specialization,
            "rating": doctor.rating,
        })



from services.notification_service import send_approval_email


class VerifyView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request, token):
        verification = get_object_or_404(DoctorVerification, token=token)


        if verification.appointment.doctor.user != request.user:
            return Response({"error": "Not allowed"}, status=403)

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

        send_approval_email(
            appointment.user,
            appointment.status
        )

        return Response({
            "status": appointment.status,
            "message": f"Appointment {appointment.status} and email sent"
        })

from .models import Doctor
from utils.permissions import IsDoctor


class CreateDoctorProfileView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request):

        name = request.data.get("name")
        specialization = request.data.get("specialization")

        if not name or not specialization:
            return Response({"error": "name and specialization required"}, status=400)

        doctor, created = Doctor.objects.get_or_create(user=request.user)

        doctor.name = name
        doctor.specialization = specialization
        doctor.save()

        return Response({
            "message": "Doctor profile saved",
            "doctor_id": doctor.id
        })