from django.test import TestCase, RequestFactory
from accounts.models import User
from accounts.permissions import AdminPermission, UserPermission, ManagerPermission

class PermissionTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.admin = User.objects.create_user(email='admin@example.com', password='adminpass', role='ADMIN')
        self.manager = User.objects.create_user(email='mgr@example.com', password='mgrpass', role='MANAGER')
        self.user = User.objects.create_user(email='user@example.com', password='userpass', role='USER')

    def test_admin_permission(self):
        request = self.factory.get('/')
        request.user = self.admin
        perm = AdminPermission()
        self.assertTrue(perm.has_permission(request, None))

    def test_manager_permission(self):
        request = self.factory.get('/')
        request.user = self.manager
        perm = ManagerPermission()
        self.assertTrue(perm.has_permission(request, None))

    def test_user_permission(self):
        request = self.factory.get('/')
        request.user = self.user
        perm = UserPermission()
        self.assertTrue(perm.has_permission(request, None))

    def test_wrong_role_fails(self):
        request = self.factory.get('/')
        request.user = self.user
        self.assertFalse(AdminPermission().has_permission(request, None))
        self.assertFalse(ManagerPermission().has_permission(request, None))
