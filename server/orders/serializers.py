from rest_framework import serializers

from accounts.models import Address
from orders.models import Cart, CartItem, ShipmentType, OrderPrint, Order
from prints.serializers import Model3DItemListSerializer


class CartAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class CartItemAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['cart','model3d', 'material', 'quantity']

class CartItemListSerializer(serializers.ModelSerializer):
    model3d = Model3DItemListSerializer(read_only=True)
    class Meta:
        model = CartItem
        fields = ['cartitem_id','model3d', 'quantity', 'material']

class ShipmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShipmentType
        fields = ['shipment_type_id', 'shipment_type', 'shipment_cost']


class OrderPrintSerializer(serializers.ModelSerializer):
    model3d = Model3DItemListSerializer()

    class Meta:
        model = OrderPrint
        fields = ['model3d', 'material', 'quantity', 'print_time_estimation']


class OrderSerializer(serializers.ModelSerializer):
    ordered_models = OrderPrintSerializer(source='orderprint_set', many=True)
    shipment_type = ShipmentTypeSerializer()
    shipping_address = serializers.StringRelatedField()

    class Meta:
        model = Order
        fields = ['order_id', 'order_status', 'total_cost', 'shipping_address', 'shipment_type', 'ordered_models', 'created_at']


class CartItemSerializer(serializers.ModelSerializer):
    model3d = Model3DItemListSerializer()

    class Meta:
        model = CartItem
        fields = ['model3d', 'material', 'quantity']


class CreateOrderSerializer(serializers.Serializer):
    shipping_address_id = serializers.UUIDField()
    shipment_type_id = serializers.UUIDField()

    def validate(self, data):
        user = self.context['request'].user

        try:
            data['shipping_address'] = Address.objects.get(address_id=data['shipping_address_id'], user=user)
        except Address.DoesNotExist:
            raise serializers.ValidationError("Invalid shipping address.")

        try:
            data['shipment_type'] = ShipmentType.objects.get(shipment_type_id=data['shipment_type_id'])
        except ShipmentType.DoesNotExist:
            raise serializers.ValidationError("Invalid shipment type.")

        return data