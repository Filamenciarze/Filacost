import uuid
from datetime import timedelta

from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from core.thread_local import get_current_user
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator

class UserRole(models.TextChoices):
    ADMIN = 'ADMIN', 'Admin'
    MANAGER = 'MANAGER', 'Manager'
    CUSTOMER = 'CUSTOMER', 'Customer'

class AppUser(AbstractUser):
    role = models.CharField(max_length=10, choices=UserRole.choices, default=UserRole.CUSTOMER, null=False, blank=False)

    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

class AuditModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)
    created_by = models.CharField(max_length=150, null=False)
    updated_by = models.CharField(max_length=150, null=False)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        user = get_current_user()
        username = user.username if user else 'system'

        if not self.pk and not self.created_by:
            self.created_by = username
        self.updated_by = username

        super().save(*args, **kwargs)

class Address(AuditModel):
    address_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, null=False)
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, null=False, blank=False)
    street_number = models.CharField(max_length=5, null=False, blank=False)
    street = models.CharField(max_length=100, null=False, blank=False)
    zipcode = models.CharField(max_length=6, null=False, blank=False, validators=[RegexValidator("^[0-9]{2}-[0-9]{3}")])
    city = models.CharField(max_length=100, null=False, blank=False)
    state = models.CharField(max_length=100, null=False, blank=False)
    country = models.CharField(max_length=100, null=False, blank=False)

class Model3D(AuditModel):
    print_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, null=False)
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, null=False, blank=False)
    filename = models.CharField(max_length=150, null=False, blank=False)
    file = models.FileField(upload_to='prints/', null=False, blank=False)
    print_fill = models.FloatField(validators=[MinValueValidator(0.01), MaxValueValidator(1.0)], null=False, blank=False)


class ShipmentType(AuditModel):
    shipment_type_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, null=False)
    shipment_type = models.CharField(max_length=100, null=False, blank=False)
    shipment_cost = models.FloatField(validators=[MinValueValidator(0.01)], null=False, blank=False)

class Order(AuditModel):
    class OrderStatus(models.TextChoices):
        PAYMENT = 'PAYMENT', 'Payment'
        PAID = 'PAID', 'Paid'
        SHIPPED = 'SHIPPED', 'Shipped'
        DELIVERED = 'DELIVERED', 'Delivered'
        CANCELLED = 'CANCELLED', 'Cancelled'


    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, null=False)
    user = models.ForeignKey(AppUser, on_delete=models.SET_NULL, null=True)
    ordered_models = models.ManyToManyField(Model3D, through='OrderPrint', null=True, blank=True)
    shipping_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    shipment_type = models.ForeignKey(ShipmentType, on_delete=models.SET_NULL, null=True)
    order_status = models.CharField(choices=OrderStatus.choices, default=OrderStatus.PAYMENT, max_length=10, null=False, blank=False)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)


class OrderPrint(AuditModel):
    class PrintMaterials(models.TextChoices):
        PETG = 'PETG', 'PETG'
        PLA = 'PLA', 'PLA'
        ABS = 'ABS', 'ABS'

    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    model3d = models.ForeignKey(Model3D, on_delete=models.CASCADE)
    material = models.CharField(choices=PrintMaterials.choices, max_length=5, null=False, blank=False)
    quantity = models.PositiveIntegerField(default=1, null=False, blank=False)
    print_time_estimation = models.DurationField(default=timedelta, null=False, blank=False)



