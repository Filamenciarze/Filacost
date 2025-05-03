from django.test import TestCase
from accounts.serializers import RegisterSerializer, LoginSerializer, UserSerializer
from accounts.models import User, Profile
from datetime import date

class RegisterSerializerTest(TestCase):
    def test_register_serializer_valid(self):
        data = {'email': 'test@example.com', 'password': 'password123'}
        serializer = RegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.email, data['email'])

    def test_register_serializer_duplicate_email(self):
        User.objects.create_user(email='test@example.com', password='password123')
        data = {'email': 'test@example.com', 'password': 'password123'}
        serializer = RegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

class LoginSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='login@example.com', password='pass123')

    def test_login_serializer_valid(self):
        data = {'email': 'login@example.com', 'password': 'pass123'}
        serializer = LoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data, self.user)

    def test_login_serializer_invalid(self):
        data = {'email': 'login@example.com', 'password': 'wrong'}
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())

class UserSerializerTest(TestCase):
    def test_user_serializer_output(self):
        user = User.objects.create_user(email='profile@example.com', password='pass123')
        Profile.objects.create(user=user, first_name='Alice', last_name='Smith', date_of_birth=date(1990,1,1))
        serializer = UserSerializer(user)
        self.assertEqual(serializer.data['email'], 'profile@example.com')
        self.assertEqual(serializer.data['profile']['first_name'], 'Alice')
