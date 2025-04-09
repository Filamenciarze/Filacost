from django.urls import path
from accounts.views import RegisterView, LoginView, CookieTokenRefreshView, LogoutView, AuthStatusView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('status/', AuthStatusView.as_view(), name='status'),
]