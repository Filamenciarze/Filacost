from django.template.context_processors import request
from rest_framework.permissions import BasePermission

class RolePermission(BasePermission):
    required_role = None

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == self.required_role

class AdminPermission(BasePermission):
    required_role = 'ADMIN'

class UserPermission(BasePermission):
    required_role = 'USER'

class ManagerPermission(BasePermission):
    required_role = 'MANAGER'