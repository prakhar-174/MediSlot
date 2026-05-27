from agents.models import PromptConfig


def get_prompt(name):
    try:
        return PromptConfig.objects.get(name=name).content
    except PromptConfig.DoesNotExist:
        return ""