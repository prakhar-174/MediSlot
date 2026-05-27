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

class DoctorListView(APIView):
    def get(self, request):
        doctors = Doctor.objects.all().prefetch_related('slots')
        data = []
        for doctor in doctors:
            slots = [{"id": s.id, "day_of_week": s.day_of_week, "start_time": s.start_time, "end_time": s.end_time, "is_blocked": s.is_blocked} for s in doctor.slots.all()]
            data.append({
                "id": doctor.id,
                "name": doctor.name,
                "specialization": doctor.specialization,
                "rating": doctor.rating,
                "slots": slots
            })
        return Response(data)

from .models import DoctorSlot

class SlotManagementView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        try:
            doctor = Doctor.objects.get(user=request.user)
            slots = doctor.slots.all()
            data = [{"id": s.id, "day_of_week": s.day_of_week, "start_time": s.start_time, "end_time": s.end_time, "is_blocked": s.is_blocked} for s in slots]
            return Response(data)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=404)

    def post(self, request):
        try:
            doctor = Doctor.objects.get(user=request.user)
            day_of_week = request.data.get("day_of_week")
            start_time = request.data.get("start_time")
            end_time = request.data.get("end_time")
            
            if not day_of_week or not start_time or not end_time:
                return Response({"error": "Missing required fields"}, status=400)
                
            slot = DoctorSlot.objects.create(
                doctor=doctor,
                day_of_week=day_of_week,
                start_time=start_time,
                end_time=end_time
            )
            return Response({"message": "Slot created", "id": slot.id})
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=404)

    def delete(self, request):
        slot_id = request.data.get("slot_id")
        try:
            doctor = Doctor.objects.get(user=request.user)
            slot = DoctorSlot.objects.get(id=slot_id, doctor=doctor)
            slot.delete()
            return Response({"message": "Slot deleted"})
        except (Doctor.DoesNotExist, DoctorSlot.DoesNotExist):
            return Response({"error": "Slot not found"}, status=404)

class AppointmentApprovalView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request, appointment_id):
        action = request.data.get("action")
        if action not in ["approved", "rejected", "completed"]:
            return Response({"error": "Invalid action"}, status=400)
            
        try:
            doctor = Doctor.objects.get(user=request.user)
            appointment = Appointment.objects.get(id=appointment_id, doctor=doctor)
            
            appointment.status = action
            appointment.save()
            
            if action in ["approved", "rejected"]:
                send_approval_email(appointment.user, action)
                
            return Response({"message": f"Appointment {action}"})
        except (Doctor.DoesNotExist, Appointment.DoesNotExist):
            return Response({"error": "Appointment not found"}, status=404)

class DailyScheduleView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        date = request.query_params.get("date")
        if not date:
            return Response({"error": "Date required"}, status=400)
            
        try:
            doctor = Doctor.objects.get(user=request.user)
            appointments = Appointment.objects.filter(doctor=doctor, date=date, status="approved")
            data = []
            for appt in appointments:
                data.append({
                    "id": appt.id,
                    "patient_name": f"{appt.user.first_name} {appt.user.last_name}".strip() or appt.user.username,
                    "time_slot": appt.time_slot,
                    "reason": appt.reason,
                    "status": appt.status
                })
            return Response(data)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=404)

from django.utils import timezone

class DashboardView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        try:
            doctor = Doctor.objects.get(user=request.user)
            today = timezone.now().date()
            
            total_today = Appointment.objects.filter(doctor=doctor, date=today, status="approved").count()
            pending_approvals = Appointment.objects.filter(doctor=doctor, status="pending").count()
            total_served = Appointment.objects.filter(doctor=doctor, status="completed").count()
            
            return Response({
                "total_today": total_today,
                "pending_approvals": pending_approvals,
                "total_served": total_served
            })
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=404)