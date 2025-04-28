from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User, Profile

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['first_name', 'last_name']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ['email', 'role', 'profile']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['email', 'password', 'profile']

    def create(self, validated_data):
        validated_data.pop('role', None)
        profile_data = validated_data.pop('profile')
        user = User.objects.create_user(role='USER', **validated_data)
        Profile.objects.create(user=user, **profile_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")