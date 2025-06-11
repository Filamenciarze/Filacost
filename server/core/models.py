from django.db import models
from core.middleware.current_user import get_current_user

class AuditModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=150, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=150, null=True, blank=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        user = get_current_user()

        username = str(user) if user and user.is_authenticated else None

        if not self.pk and not self.created_by:
            self.created_by = username

        self.updated_by = username

        super().save(*args, **kwargs)
