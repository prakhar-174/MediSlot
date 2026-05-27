from django.urls import path
from .views import PreBookView, AppointmentListView, CancelAppointmentView

urlpatterns = [
    path("prebook/", PreBookView.as_view()),
    path("", AppointmentListView.as_view()),
    path("<int:appointment_id>/cancel/", CancelAppointmentView.as_view()),
]