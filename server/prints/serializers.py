from rest_framework import serializers

from prints.models import Model3D


class Model3DSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model3D
        fields = ["user", "filename_display", "file", "print_fill"]