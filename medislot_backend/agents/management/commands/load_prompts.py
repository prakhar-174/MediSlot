from django.core.management.base import BaseCommand
from agents.models import PromptConfig
import yaml
import os


class Command(BaseCommand):
    help = "Load prompts from YAML into DB"

    def handle(self, *args, **kwargs):
        path = os.path.join("config", "prompt.yaml")

        if not os.path.exists(path):
            self.stdout.write(self.style.ERROR("❌ prompt.yaml not found"))
            return

        with open(path, "r") as f:
            data = yaml.safe_load(f)

        for name, content in data.items():
            PromptConfig.objects.update_or_create(
                name=name,
                defaults={"content": content}
            )

        self.stdout.write(self.style.SUCCESS("✅ Prompts loaded successfully"))