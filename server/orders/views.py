import uuid

from django.http import Http404
from rest_framework import status

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Cart, CartItem, PrintMaterials
from orders.serializers import CartItemAddSerializer, CartItemListSerializer
from prints.models import Model3D

from django.db.models import F

class CartView(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request):
        cart_item_id = request.data['cartitem_id']

        if not cart_item_id:
            return Response({'detail': 'cart_item_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # konwersja na UUID:
            cart_item_uuid = uuid.UUID(cart_item_id)
        except ValueError:
            return Response({'detail': 'Invalid cart_item_id format (must be UUID)'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = CartItem.objects.get(cartitem_id=cart_item_uuid, cart__user=request.user)
            cart_item.delete()
            return Response({'detail': 'Item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({'detail': 'CartItem not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        data = request.data
        print(data)

        try:
            model = Model3D.objects.get(user=request.user, print_id=data['print_id'])
        except Model3D.DoesNotExist:
            raise Http404

        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            raise Http404

        data['model3d'] = model
        data['cart'] = cart
        data['material'] = data.get('material', PrintMaterials.PLA)
        quantity_to_add = int(data.get('quantity', 1))

        # Sprawdzamy czy już istnieje taki element w koszyku:
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            model3d=model,
            material=data['material'],
            defaults={'quantity': quantity_to_add}
        )

        if not created:
            # Element już istniał — zwiększamy ilość:
            cart_item.quantity = F('quantity') + quantity_to_add
            cart_item.save()
            cart_item.refresh_from_db()  # odświeżamy by pobrać aktualną ilość po F()

        serializer = CartItemAddSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request):
        cart_item_id = request.data.get('cartitem_id')
        quantity = request.data.get('quantity')

        if not cart_item_id or quantity is None:
            return Response({'detail': 'cartitem_id and quantity are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item_uuid = uuid.UUID(cart_item_id)
        except ValueError:
            return Response({'detail': 'Invalid cartitem_id format (must be UUID)'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = CartItem.objects.get(cartitem_id=cart_item_uuid, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'detail': 'CartItem not found'}, status=status.HTTP_404_NOT_FOUND)

        quantity = int(quantity)
        if quantity <= 0:
            cart_item.delete()
            return Response({'detail': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)

        cart_item.quantity = quantity
        cart_item.save()
        serializer = CartItemAddSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CartListView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CartItemListSerializer

    def get_queryset(self):
        user = self.request.user
        try:
            cart = Cart.objects.get(user=user)
            return CartItem.objects.filter(cart=cart)
        except Cart.DoesNotExist:
            return CartItem.objects.none()


