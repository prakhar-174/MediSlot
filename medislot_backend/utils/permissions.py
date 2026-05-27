from rest_framework.permissions import BasePermission


class IsDoctor(BasePermission):
    message = "Access restricted to verified doctors only."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.profile.role == 'doctor'
        except AttributeError:
            return False


class IsPatient(BasePermission):
    message = "Access restricted to patients only."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.profile.role == 'patient'
        except AttributeError:
            return False
