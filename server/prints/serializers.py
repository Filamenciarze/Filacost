from rest_framework import serializers

from prints.models import Model3D


class Model3DUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model3D
        fields = ["user", "filename_display", "file", "print_fill"]

    def get_file(self, instance):
        return instance.file.url

class Model3DItemListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model3D
        fields = ["print_id","filename_display", "file", "print_fill", "created_at"]