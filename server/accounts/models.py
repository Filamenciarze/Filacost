from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.core.validators import MaxValueValidator, RegexValidator
from phonenumber_field.modelfields import PhoneNumberField
from django.db import models
from datetime import date
import uuid

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, role='USER', **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, role='ADMIN', **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('USER', 'USER'),
        ('MANAGER', 'MANAGER'),
        ('ADMIN', 'ADMIN'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField(validators=[MaxValueValidator(date.today)], blank=True)
    phone_number = PhoneNumberField(blank=True, region='PL')

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

class Address(models.Model):
    address_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)
    street_number = models.CharField(max_length=5, null=False, blank=False)
    street = models.CharField(max_length=100, null=False, blank=False)
    zipcode = models.CharField(max_length=6, null=False, blank=False, validators=[RegexValidator("^[0-9]{2}-[0-9]{3}")])
    city = models.CharField(max_length=100, null=False, blank=False)
    state = models.CharField(max_length=100, null=False, blank=False)
    country = models.CharField(max_length=100, null=False, blank=False)