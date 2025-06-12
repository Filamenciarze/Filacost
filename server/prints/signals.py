from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Model3D

@receiver(post_delete, sender=Model3D)
def delete_file_on_model_delete(sender, instance, **kwargs):
    if instance.file:
        instance.file.delete(save=False)
