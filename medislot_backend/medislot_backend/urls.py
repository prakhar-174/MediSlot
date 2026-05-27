from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/auth/", include("users.urls")),
    path("api/reports/", include("reports.urls")),
    path("api/bookings/", include("bookings.urls")),
    path("api/", include("agents.urls")),
    path("api/symptoms/", include("symptoms.urls")),
    path("api/doctors/", include("doctors.urls")),
]