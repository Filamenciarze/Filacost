from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User, Profile, Address


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'date_of_birth', 'phone_number']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ['email', 'role', 'profile']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value

    def create(self, validated_data):
        validated_data.pop('role', None)
        user = User.objects.create_user(role='USER', **validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'address_id',
            'street_number',
            'street',
            'zipcode',
            'city',
            'state',
            'country'
        ]