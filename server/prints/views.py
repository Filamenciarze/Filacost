from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from prints.models import Model3D
from prints.serializers import Model3DSerializer


class Model3DView(APIView):
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
        serializer = Model3DSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request):

        return Response({
            "models": Model3D.objects.all()
        }, status=status.HTTP_200_OK)