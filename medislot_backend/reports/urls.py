from django.urls import path
from .views import UploadReportView, ReportListView

urlpatterns = [
    path("upload/", UploadReportView.as_view()),
    path("", ReportListView.as_view()),
]