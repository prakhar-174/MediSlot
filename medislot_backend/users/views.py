from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile


def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token)}





class RegisterView(APIView):

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        role = request.data.get("role", UserProfile.PATIENT)
        name = request.data.get("name", "")
        email = request.data.get("email", "")

        if not username or not password:
            return Response({"error": "username and password required"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "username already exists"}, status=400)

        
        user = User.objects.create_user(username=username, password=password)
        if name:
            parts = name.split(" ", 1)
            user.first_name = parts[0]
            if len(parts) > 1:
                user.last_name = parts[1]
        if email:
            user.email = email
        user.save()
       
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={"role": role, "email": email}
        )

        if not created:
            profile.role = role
            profile.email = email
            profile.save()

        if role == UserProfile.DOCTOR:
            from doctors.models import Doctor, DoctorSlot
            from datetime import time
            specialization = request.data.get("specialization", "")
            available_days = request.data.get("availableDays", [])
            doctor, doc_created = Doctor.objects.get_or_create(
                user=user,
                defaults={"name": name, "specialization": specialization}
            )
            for day in available_days:
                DoctorSlot.objects.create(
                    doctor=doctor,
                    day_of_week=day,
                    start_time=time(9, 0),
                    end_time=time(17, 0)
                )

        tokens = get_tokens(user)

        return Response({
            "access": tokens["access"],
            "role": profile.role,
            "name": name
        }, status=201)

class LoginView(APIView):

    def post(self, request):
        user = authenticate(
            username=request.data.get("username"),
            password=request.data.get("password"),
        )

        if not user:
            return Response({"error": "Invalid credentials"}, status=401)

        tokens = get_tokens(user)

        role = getattr(user.profile, "role", None)

        return Response({
            "access": tokens["access"],
            "role": role,
            "name": f"{user.first_name} {user.last_name}".strip()
        })



class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = getattr(request.user.profile, "role", None)
        email = getattr(request.user.profile, "email", request.user.email)
        name = f"{request.user.first_name} {request.user.last_name}".strip()
        phone = getattr(request.user.profile, "phone", "")

        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "name": name,
            "email": email,
            "phone": phone,
            "role": role,
        })


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        email = request.data.get("email")
        name = request.data.get("name")
        phone = request.data.get("phone")

        if email:
            request.user.profile.email = email
            request.user.email = email
        if phone:
            request.user.profile.phone = phone
        if name:
            parts = name.split(" ", 1)
            request.user.first_name = parts[0]
            if len(parts) > 1:
                request.user.last_name = parts[1]
            else:
                request.user.last_name = ""
        
        request.user.profile.save()
        request.user.save()

        return Response({"status": "profile saved"})


from .models import Notification

class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).order_by("-created_at")
        data = []
        for n in notifications:
            data.append({
                "id": n.id,
                "message": n.message,
                "type": n.type,
                "is_read": n.is_read,
                "created_at": n.created_at
            })
        return Response(data)

    def patch(self, request):
        # Mark all as read
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"status": "all marked as read"})


class NotificationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            notification = Notification.objects.get(id=pk, user=request.user)
            notification.is_read = True
            notification.save()
            return Response({"status": "marked as read"})
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=404)