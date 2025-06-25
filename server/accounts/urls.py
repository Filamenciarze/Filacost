from django.urls import path
from accounts.views import RegisterView, LoginView, CookieTokenRefreshView, LogoutView, AuthStatusView, \
    ProfileRetrieveUpdateView, AddressListCreateView, AddressUpdateView, AddressDeleteView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('status/', AuthStatusView.as_view(), name='status'),
    # Profile
    path('profile/', ProfileRetrieveUpdateView.as_view(), name='profile'),

    # Address
    path('addresses/', AddressListCreateView.as_view(), name='address-list-create'),
    path('addresses/update/', AddressUpdateView.as_view(), name='address-detail'),
    path('addresses/delete/', AddressDeleteView.as_view(), name='address-delete'),
]