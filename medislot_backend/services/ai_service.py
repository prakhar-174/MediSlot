from groq import Groq
import os
import json
from services.prompt_service import get_prompt

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def call_ai(text):
    base_prompt = get_prompt("medical_prompt")

    prompt = f"""
{base_prompt}

Report:
{text[:2000]}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}]
        )

        output = response.choices[0].message.content

        start = output.find("{")
        end = output.rfind("}") + 1

        return json.loads(output[start:end])

    except Exception as e:
        print("Groq Error:", str(e))
        return {
            "summary": "Could not analyze report",
            "severity": "unknown",
            "doctor_type": "General Physician",
            "condition": "Unknown",
            "precautions": [],
            "key_advice": [],
            "recommendations": []
        }


def chat_ai(message, history, extra_context=""):
    base_prompt = get_prompt("chat_prompt")

    system_prompt = base_prompt.replace("{extra_context}", extra_context)

    messages = [{"role": "system", "content": system_prompt}]

    for h in history:
        messages.append({"role": "user", "content": h["user"]})
        messages.append({"role": "assistant", "content": h["bot"]})

    messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages
        )

        return response.choices[0].message.content

    except Exception as e:
        print("Chat AI Error:", str(e))
        return "Sorry, I couldn't process your request."