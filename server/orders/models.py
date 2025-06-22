from django.db import models
from django.core.validators import MinValueValidator
import uuid
from datetime import timedelta

from core import settings
from core.models import AuditModel
from prints.models import Model3D
from accounts.models import Address, User

class ShipmentType(AuditModel):
    shipment_type_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, null=False)
    shipment_type = models.CharField(max_length=100, null=False, blank=False)
    shipment_cost = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)], null=False, blank=False)

class PrintMaterials(models.TextChoices):
    PETG = 'PETG', 'PETG'
    PLA = 'PLA', 'PLA'
    ABS = 'ABS', 'ABS'

class OrderStatus(models.TextChoices):
    PAYMENT = 'PAYMENT', 'Payment'
    PAID = 'PAID', 'Paid'
    SHIPPED = 'SHIPPED', 'Shipped'
    DELIVERED = 'DELIVERED', 'Delivered'
    CANCELLED = 'CANCELLED', 'Cancelled'

class Order(AuditModel):

    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, null=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    ordered_models = models.ManyToManyField(Model3D, through='OrderPrint')
    shipping_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    shipment_type = models.ForeignKey(ShipmentType, on_delete=models.SET_NULL, null=True)
    order_status = models.CharField(choices=OrderStatus.choices, default=OrderStatus.PAYMENT, max_length=10, null=False,
                                    blank=False)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)

class OrderPrint(AuditModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
    model3d = models.ForeignKey(Model3D, on_delete=models.CASCADE, null=True)
    material = models.CharField(choices=PrintMaterials.choices, max_length=5, null=False, blank=False)
    quantity = models.PositiveIntegerField(default=1, null=False, blank=False)
    print_time_estimation = models.DurationField(default=timedelta, null=False, blank=False)


class Cart(models.Model):
    cart_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, null=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class CartItem(models.Model):
    cartitem_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, null=False)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    model3d = models.ForeignKey(Model3D, on_delete=models.CASCADE)
    material = models.CharField(max_length=5, choices=PrintMaterials.choices)
    quantity = models.PositiveIntegerField(default=1)