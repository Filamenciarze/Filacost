from rest_framework import serializers

from orders.models import Cart, CartItem


class CartAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class CartItemAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['model3d', 'material', 'quantity']