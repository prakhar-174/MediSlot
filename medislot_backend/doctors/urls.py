from django.urls import path
from .views import (
    DoctorProfileView, VerifyView, CreateDoctorProfileView, DoctorListView,
    SlotManagementView, AppointmentApprovalView, DailyScheduleView, DashboardView
)

urlpatterns = [
    path("profile/", DoctorProfileView.as_view()),
    path("verify/<uuid:token>/", VerifyView.as_view()),
    path("create-profile/", CreateDoctorProfileView.as_view()),
    path("list/", DoctorListView.as_view()),
    path("slots/", SlotManagementView.as_view()),
    path("appointments/<int:appointment_id>/action/", AppointmentApprovalView.as_view()),
    path("schedule/", DailyScheduleView.as_view()),
    path("dashboard/", DashboardView.as_view()),
]
