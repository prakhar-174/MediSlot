from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Appointment

class PreBookView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        doctor_id = request.data.get("doctor_id")
        date = request.data.get("date")
        time_slot = request.data.get("time_slot")
        reason = request.data.get("reason", "")
        report_id = request.data.get("report_id")

        if not request.user.profile.email:
            return Response(
                {"error": "Please add email before booking"},
                status=400
            )

        if not doctor_id or not date or not time_slot:
            return Response({"error": "doctor_id, date & time_slot required"}, status=400)


        appointment = Appointment.objects.create(
            user=request.user,
            doctor_id=doctor_id,
            date=date,
            time_slot=time_slot,
            reason=reason,
            report_id=report_id
        )

        return Response({
            "appointment_id": appointment.id,
            "status": "pending"
        })


class AppointmentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        appointments = Appointment.objects.filter(user=request.user).select_related('doctor')
        data = []
        for appt in appointments:
            data.append({
                "id": appt.id,
                "doctor_name": appt.doctor.name,
                "doctor_specialization": appt.doctor.specialization,
                "date": appt.date,
                "time_slot": appt.time_slot,
                "reason": appt.reason,
                "report_id": appt.report_id,
                "status": appt.status,
                "created_at": appt.created_at
            })
        return Response(data)

class CancelAppointmentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, appointment_id):
        try:
            appt = Appointment.objects.get(id=appointment_id, user=request.user)
            if appt.status != "pending":
                return Response({"error": "Only pending appointments can be cancelled"}, status=400)
            appt.status = "cancelled"
            appt.save()
            return Response({"message": "Appointment cancelled successfully"})
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)