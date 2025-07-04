from django.urls import path

from orders.views import CartView, CartListView, UserOrdersListView, OrderDetailView, CreateOrderFromCartView, \
    ShipmentTypeView, AllOrdersListView, OrderDeleteView, OrderUpdateView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/list/', CartListView.as_view(), name='cart_list'),
    path('list/', UserOrdersListView.as_view(), name="orders"),
    path('details/', OrderDetailView.as_view(), name='order_detail'),
    path('create/', CreateOrderFromCartView.as_view(), name='create_order'),
    path('shipment/', ShipmentTypeView.as_view(), name='shipment_type'),
    path('shipment/create/', ShipmentTypeView.as_view(), name='shipment_create'),
    path('all/', AllOrdersListView.as_view(), name='all_orders'),
    path('update/', OrderUpdateView.as_view(), name='update_order'),
    path('delete/', OrderDeleteView.as_view(), name='delete_order'),
]