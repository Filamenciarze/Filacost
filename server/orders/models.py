from django.db import models
from django.core.validators import MinValueValidator
import uuid
from datetime import timedelta

from prints.models import Model3D
from accounts.models import Address, User

class ShipmentType(models.Model):
    shipment_type_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, null=False)
    shipment_type = models.CharField(max_length=100, null=False, blank=False)
    shipment_cost = models.FloatField(validators=[MinValueValidator(0.01)], null=False, blank=False)


class Order(models.Model):
    class OrderStatus(models.TextChoices):
        PAYMENT = 'PAYMENT', 'Payment'
        PAID = 'PAID', 'Paid'
        SHIPPED = 'SHIPPED', 'Shipped'
        DELIVERED = 'DELIVERED', 'Delivered'
        CANCELLED = 'CANCELLED', 'Cancelled'

    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, null=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    ordered_models = models.ManyToManyField(Model3D, through='OrderPrint')
    shipping_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    shipment_type = models.ForeignKey(ShipmentType, on_delete=models.SET_NULL, null=True)
    order_status = models.CharField(choices=OrderStatus.choices, default=OrderStatus.PAYMENT, max_length=10, null=False,
                                    blank=False)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)


class OrderPrint(models.Model):
    class PrintMaterials(models.TextChoices):
        PETG = 'PETG', 'PETG'
        PLA = 'PLA', 'PLA'
        ABS = 'ABS', 'ABS'

    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
    model3d = models.ForeignKey(Model3D, on_delete=models.CASCADE, null=True)
    material = models.CharField(choices=PrintMaterials.choices, max_length=5, null=False, blank=False)
    quantity = models.PositiveIntegerField(default=1, null=False, blank=False)
    print_time_estimation = models.DurationField(default=timedelta, null=False, blank=False)