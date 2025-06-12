from rest_framework import serializers

from prints.models import Model3D


class Model3DUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model3D
        fields = ["user", "filename_display", "file", "print_fill"]

    def get_file(self, instance):
        return instance.file.url

class Model3DFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model3D
        fields = ["user", "filename_display", "file", "print_fill", "print_cost", "print_time_s"]

class Model3DItemListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model3D
        fields = ["print_id","filename_display", "file", "print_fill", "print_cost", "print_time_s", "created_at"]