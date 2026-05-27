from django.urls import path
from .views import DoctorProfileView, VerifyView , CreateDoctorProfileView

urlpatterns = [
    path("profile/", DoctorProfileView.as_view()),
    path("verify/<uuid:token>/", VerifyView.as_view()),
    path("create-profile/", CreateDoctorProfileView.as_view()),
]
