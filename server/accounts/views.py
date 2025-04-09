from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from environs import Env
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import status
from accounts.serializers import RegisterSerializer, UserSerializer, LoginSerializer

env = Env()
env.read_env("../.env")

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class AuthStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "authenticated": True,
            "user": UserSerializer(request.user).data,
        })

class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        tokens = get_tokens_for_user(user)

        response = Response({
            'user': UserSerializer(user).data,
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key='access_token',
            value=str(tokens['access']),
            httponly=True,
            secure=env.str("PROFILE") == "PROD",
            samesite='Lax',
        )

        response.set_cookie(
            key='refresh_token',
            value=str(tokens['refresh']),
            httponly=True,
            secure=env.str("PROFILE") == "PROD",
            samesite='Lax',
        )

        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'detail': 'No refresh token found'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data={'refresh': refresh_token})
        serializer.is_valid(raise_exception=True)

        response = Response({"detail": "token has been refreshed"}, status=200)
        response.set_cookie(
            key='access_token',
            value=serializer.validated_data['access'],
            httponly=True,
            secure=env.str("PROFILE") == "PROD",
            samesite='Lax'
        )
        return response

class LogoutView(APIView):
    def post(self, request):
        response = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
        response.delete_cookie(key='access_token')
        response.delete_cookie(key='refresh_token')
        return response
