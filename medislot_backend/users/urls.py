from django.urls import path
from .views import RegisterView, LoginView, MeView,UpdateEmailView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("me/", MeView.as_view()),
    path("update-email/", UpdateEmailView.as_view()),
]
