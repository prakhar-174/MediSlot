from django.urls import path
from .views import ShareView, VerifyView, PendingVerificationsView, PromptConfigListView, PromptConfigDetailView

urlpatterns = [
    path("share/<int:appointment_id>/", ShareView.as_view()),
    path("verify/<uuid:token>/", VerifyView.as_view()),
    path("pending/", PendingVerificationsView.as_view()),
    path("prompts/", PromptConfigListView.as_view()),
    path("prompts/<str:name>/", PromptConfigDetailView.as_view()),
]