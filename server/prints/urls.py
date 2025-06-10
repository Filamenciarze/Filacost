from django.urls import path
from prints.views import Model3DView, Model3DListView

urlpatterns = [
    path('', Model3DView.as_view(), name='index'),
    path('list', Model3DListView.as_view(), name='list'),
]