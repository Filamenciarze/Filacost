from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import User

class AuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.status_url = reverse('status')
        self.logout_url = reverse('logout')
        self.token_refresh_url = reverse('token_refresh')

        self.user_data = {
            'email': 'testuser@example.com',
            'password': 'strongpassword123'
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=self.user_data['email']).exists())

    def test_login_sets_tokens(self):
        User.objects.create_user(**self.user_data)
        response = self.client.post(self.login_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.cookies)
        self.assertIn('refresh_token', response.cookies)

    def test_auth_status_authenticated(self):
        user = User.objects.create_user(**self.user_data)
        self.client.force_authenticate(user=user)
        response = self.client.get(self.status_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['authenticated'])

    def test_auth_status_unauthenticated(self):
        response = self.client.get(self.status_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_deletes_tokens(self):
        user = User.objects.create_user(**self.user_data)
        self.client.force_authenticate(user=user)
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.cookies)
        self.assertEqual(response.cookies['access_token'].value, '')
        self.assertEqual(response.cookies['refresh_token'].value, '')

    def test_token_refresh_with_cookie(self):
        user = User.objects.create_user(**self.user_data)
        login_response = self.client.post(self.login_url, self.user_data)
        refresh_token = login_response.cookies['refresh_token'].value

        self.client.cookies['refresh_token'] = refresh_token
        response = self.client.post(self.token_refresh_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.cookies)

    def test_token_refresh_without_cookie(self):
        response = self.client.post(self.token_refresh_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
