from rest_framework.views import APIView
from rest_framework.response import Response

from reports.models import Report
from services.ai_service import chat_ai
from utils.permissions import IsPatient

from .models import ChatSession, ChatMessage


class ChatbotView(APIView):
    permission_classes = [IsPatient]

    def post(self, request):
        message = request.data.get("message")
        session_id = request.data.get("session_id")

        if not message:
            return Response({"error": "message required"}, status=400)

        if session_id:
            try:
                session = ChatSession.objects.get(id=session_id, user=request.user)
            except ChatSession.DoesNotExist:
                return Response({"error": "Invalid session"}, status=400)
        else:
            session = ChatSession.objects.create(user=request.user)

        history_qs = ChatMessage.objects.filter(session=session).order_by("-created_at")[:5]
        history = [
            {"user": msg.user_message, "bot": msg.bot_response}
            for msg in reversed(list(history_qs))
        ]

        reports = Report.objects.filter(user=request.user).order_by("-created_at")[:2]
        report_context = "".join(str(r.analysis) + "\n" for r in reports if r.analysis)

        reply = chat_ai(message=message, history=history, extra_context=report_context)

        ChatMessage.objects.create(
            session=session,
            user_message=message,
            bot_response=reply,
        )

        return Response({"session_id": session.id, "reply": reply})
