from rest_framework import serializers

from orders.models import Cart, CartItem
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