from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from accounts.models import User
import uuid

def generate_filename():
    return f'model_{uuid.uuid4().hex}'

class Model3D(models.Model):
    print_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)
    filename_display = models.CharField(max_length=150, null=False, blank=False)
    filename = models.CharField(max_length=150, null=False, blank=False, default=generate_filename, unique=True)
    file = models.FileField(upload_to="stl_files/")
    print_fill = models.FloatField(validators=[MinValueValidator(0.01), MaxValueValidator(1.0)])