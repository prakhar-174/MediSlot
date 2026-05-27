from rest_framework.views import APIView
from rest_framework.response import Response

from agents.orchestrator import run_orchestrator
from utils.permissions import IsPatient

from .models import Report
from .utils import extract_text_from_pdf

import json


def make_json_safe(data):
    return json.loads(json.dumps(data, default=str))


class UploadReportView(APIView):
    permission_classes = [IsPatient]

    def post(self, request):
        file = request.FILES.get("file")

        if not file:
            return Response({"error": "file required"}, status=400)

        report = Report.objects.create(user=request.user, file=file)

        text = extract_text_from_pdf(file)
        report.extracted_text = text

        result = run_orchestrator({"report_text": text})

        safe_result = make_json_safe(result)

        report.analysis = safe_result
        report.save()

        return Response({
            "report_id": report.id,
            "analysis": safe_result
        })


class ReportListView(APIView):
    permission_classes = [IsPatient]

    def get(self, request):
        reports = Report.objects.filter(user=request.user)
        return Response(list(reports.values()))