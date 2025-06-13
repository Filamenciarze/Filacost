from django.http import Http404
from rest_framework import status

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Cart, CartItem
from orders.serializers import CartItemAddSerializer
from prints.models import Model3D


class CartView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = request.data
        try:
            model = Model3D.objects.get(user=request.user, print_id=data['print_id'])
        except Model3D.DoesNotExist:
            raise Http404

        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            raise Http404

        data['model3d'] = model.print_id
        data['cart'] = cart.id
        serializer = CartItemAddSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CartListView(ListAPIView):
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        cart = Cart.objects.filter(user=user)

        if cart:
            return CartItem.objects.filter(cart=cart)
        else:
            return CartItem.objects.none()

