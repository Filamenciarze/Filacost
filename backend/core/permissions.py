from rest_framework.permissions import BasePermission
from rest.models import UserRole


class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == UserRole.ADMIN

class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == UserRole.MANAGER

class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == UserRole.CUSTOMER