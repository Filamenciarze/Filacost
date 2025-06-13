from django.urls import path

from orders.views import CartView, CartListView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/list/', CartListView.as_view(), name='cart_list'),
]