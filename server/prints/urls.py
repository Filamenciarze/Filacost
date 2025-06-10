from django.urls import path
from prints.views import Model3DView

urlpatterns = [
    path('', Model3DView.as_view(), name='index'),
]