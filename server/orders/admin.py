from django.contrib import admin

from orders.models import ShipmentType, Order, OrderPrint

admin.site.register(ShipmentType)
admin.site.register(Order)
admin.site.register(OrderPrint)
