import json

from django.http import Http404
from environs import Env
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import requests

from prints.models import Model3D
from prints.serializers import Model3DSerializer


class Model3DView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        model_id = request.GET.get('id')
        try:
            model = Model3D.objects.filter(id=model_id).first()
        except Model3D.DoesNotExist:
            raise Http404
        return Response({
            "model": model
        }, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        data["user"] = request.user.id
        serializer = Model3DSerializer(data=data)
        if serializer.is_valid():
            model = serializer.save()
            cost = self._slicer_request(model)
            return Response(cost, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        model_id = request.GET.get('id')
        try:
            model = Model3D.objects.get(print_id=model_id, user=request.user)
        except Model3D.DoesNotExist:
            return Response({"detail": "Model not found or access denied."}, status=status.HTTP_404_NOT_FOUND)

        model.delete()
        return Response({"detail": "Model deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    def _slicer_request(self, model):
        env = Env()
        env.read_env("../.env")
        slicer_url = f"http://{env.str("SLICER_HOST")}:{env.str("SLICER_PORT")}/slice"

        with open(model.file.path, "rb") as f:
            files = {
                "stl_file": (model.filename_display, f, "application/sla")
            }
            response = requests.post(slicer_url, files=files)
            cost = json.loads(response.text)
            cost['cost'] += cost['est_time_seconds']/3600*1.11*0.7
            return cost

class Model3DListView(ListAPIView):
    serializer_class = Model3DSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Model3D.objects.filter(user=self.request.user).order_by('-id')