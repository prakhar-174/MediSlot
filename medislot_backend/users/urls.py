from django.urls import path
from .views import RegisterView, LoginView, MeView, UpdateProfileView, NotificationListView, NotificationDetailView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("me/", MeView.as_view()),
    path("update-profile/", UpdateProfileView.as_view()),
    path("notifications/", NotificationListView.as_view()),
    path("notifications/read-all/", NotificationListView.as_view()), # Using patch method of ListView
    path("notifications/<int:pk>/read/", NotificationDetailView.as_view()),
]
