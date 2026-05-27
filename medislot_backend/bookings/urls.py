from django.urls import path
from .views import PreBookView, AppointmentListView

urlpatterns = [
    path("prebook/", PreBookView.as_view()),
    path("", AppointmentListView.as_view()),
]