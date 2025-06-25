import uuid
from datetime import timedelta

from django.db import transaction
from django.http import Http404
from rest_framework import status, generics

from rest_framework.generics import ListAPIView, get_object_or_404, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import ManagerPermission
from orders.models import Cart, CartItem, PrintMaterials, OrderPrint, Order, ShipmentType
from orders.serializers import CartItemAddSerializer, CartItemListSerializer, OrderSerializer, CreateOrderSerializer, \
    ShipmentTypeSerializer
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


class AllOrdersListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, ManagerPermission]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.all().order_by('-created_at')

class OrderDeleteView(APIView):
    permission_classes = (IsAuthenticated, ManagerPermission)

    def delete(self, request):
        order_id = request.data.get('order_id')
        if not order_id:
            return Response({'detail': 'order_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        order = get_object_or_404(Order, order_id=order_id)

        order.delete()

        return Response({'detail': 'Order deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class OrderUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated, ManagerPermission)
    serializer_class = OrderSerializer

    def put(self, request):
        order_id = request.data.get('order_id')
        if not order_id:
            return Response({'detail': 'order_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        order = get_object_or_404(Order, id=order_id)

        serializer = self.get_serializer(order, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()


        return Response(serializer.data, status=status.HTTP_200_OK)


class UserOrdersListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    lookup_field = 'order_id'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class CreateOrderFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = request.user

        try:
            cart = Cart.objects.get(user=user)
            cart_items = CartItem.objects.filter(cart=cart)
            if not cart_items.exists():
                return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)
        except Cart.DoesNotExist:
            return Response({"detail": "Cart does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        total_cost = sum(item.model3d.print_cost * item.quantity for item in cart_items)
        total_cost += serializer.validated_data['shipment_type'].shipment_cost

        order = Order.objects.create(
            user=user,
            shipping_address=serializer.validated_data['shipping_address'],
            shipment_type=serializer.validated_data['shipment_type'],
            total_cost=total_cost
        )

        for item in cart_items:
            OrderPrint.objects.create(
                order=order,
                model3d=item.model3d,
                material=item.material,
                quantity=item.quantity,
                print_time_estimation=timedelta(seconds=item.model3d.print_time_s)
            )

        cart_items.delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class ShipmentTypeView(APIView):
    permission_classes = [IsAuthenticated]


    def get(self, request):
        shipment_types = ShipmentType.objects.all()
        serializer = ShipmentTypeSerializer(shipment_types, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if not ManagerPermission().has_permission(request, self):
            return Response({'detail': 'Permission denied.'},
                            status=status.HTTP_403_FORBIDDEN)
        serializer = ShipmentTypeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request):
        if not ManagerPermission().has_permission(request, self):
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        shipment_type_id = request.data.get('shipment_type_id')
        if not shipment_type_id:
            return Response({'detail': 'ID is required for update.'}, status=status.HTTP_400_BAD_REQUEST)

        shipment_type = get_object_or_404(ShipmentType, pk=shipment_type_id)
        serializer = ShipmentTypeSerializer(shipment_type, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request):
        if not ManagerPermission().has_permission(request, self):
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        shipment_type_id = request.data.get('id')
        if not shipment_type_id:
            return Response({'detail': 'ID is required for deletion.'}, status=status.HTTP_400_BAD_REQUEST)

        shipment_type = get_object_or_404(ShipmentType, pk=shipment_type_id)
        shipment_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


