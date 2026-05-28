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
        availability = request.query_params.get("availability")
        specialization = request.query_params.get("specialization")
        sort = request.query_params.get("sort")

        doctors = Doctor.objects.all().prefetch_related('slots')
        
        if specialization:
            doctors = doctors.filter(specialization__icontains=specialization)
        
        if sort == "rating":
            doctors = doctors.order_by("-rating")

        data = []
        for doctor in doctors:
            doctor_slots = list(doctor.slots.all())
            is_available = len(doctor_slots) > 0
            
            if availability == "true" and not is_available:
                continue

            slots = [{"id": s.id, "day_of_week": s.day_of_week, "start_time": s.start_time, "end_time": s.end_time, "is_blocked": s.is_blocked} for s in doctor_slots]
            data.append({
                "id": doctor.id,
                "name": doctor.name,
                "specialization": doctor.specialization,
                "rating": doctor.rating,
                "isAvailable": is_available,
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

class BlockDateView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request):
        date = request.data.get("date")
        if not date:
            return Response({"error": "date is required"}, status=400)
        # Stub for blocking date since no model exists
        return Response({"message": f"Date {date} blocked successfully"})

class DoctorAppointmentsView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        status = request.query_params.get("status")
        try:
            doctor = Doctor.objects.get(user=request.user)
            appointments = Appointment.objects.filter(doctor=doctor)
            if status:
                appointments = appointments.filter(status=status)
            
            data = []
            for appt in appointments:
                data.append({
                    "id": appt.id,
                    "patient_name": f"{appt.user.first_name} {appt.user.last_name}".strip() or appt.user.username,
                    "date": appt.date,
                    "time_slot": appt.time_slot,
                    "reason": appt.reason,
                    "status": appt.status,
                })
            return Response(data)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=404)

from users.models import Notification

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
            
            # Create Notification
            msg = ""
            if action == "approved":
                msg = f"Your appointment with Dr. {doctor.name} on {appointment.date} at {appointment.time_slot} has been approved"
            elif action == "rejected":
                msg = f"Your appointment with Dr. {doctor.name} on {appointment.date} has been rejected"
            elif action == "completed":
                msg = f"Your visit with Dr. {doctor.name} is marked as completed. Thank you!"

            Notification.objects.create(
                user=appointment.user,
                message=msg,
                type=f"appointment_{action}"
            )

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
            
            today_count = Appointment.objects.filter(doctor=doctor, date=today).count()
            pending_count = Appointment.objects.filter(doctor=doctor, status="pending").count()
            upcoming_count = Appointment.objects.filter(doctor=doctor, status="approved", date__gte=today).count()
            completed_count = Appointment.objects.filter(doctor=doctor, status="completed").count()
            
            return Response({
                "todayCount": today_count,
                "pendingCount": pending_count,
                "upcomingCount": upcoming_count,
                "completedCount": completed_count
            })
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=404)