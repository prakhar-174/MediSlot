from django.contrib import admin
from .models import PromptConfig


@admin.register(PromptConfig)
class PromptConfigAdmin(admin.ModelAdmin):
    list_display = ("name", "updated_at")
    search_fields = ("name",)