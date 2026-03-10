import 'package:flutter/material.dart';
import 'models.dart';

class CartProvider with ChangeNotifier {
  final Map<int, CartItem> _items = {};

  List<CartItem> get items => _items.values.toList();

  int get itemCount => _items.length;

  double get totalAmount {
    double total = 0.0;
    _items.forEach((key, item) {
      total += item.total;
    });
    return total;
  }

  void addItem(Product product) {
    if (_items.containsKey(product.id)) {
      _items.update(
        product.id,
        (existingItem) => CartItem(
          product: existingItem.product,
          quantity: existingItem.quantity + 1,
        ),
      );
    } else {
      _items.putIfAbsent(
        product.id,
        () => CartItem(product: product),
      );
    }
    notifyListeners();
  }

  void removeItem(int productId) {
    _items.remove(productId);
    notifyListeners();
  }

  void clear() {
    _items.clear();
    notifyListeners();
  }

  void updateQuantity(int productId, int quantity) {
    if (quantity <= 0) {
      removeItem(productId);
    } else if (_items.containsKey(productId)) {
      _items.update(
        productId,
        (existingItem) => CartItem(
          product: existingItem.product,
          quantity: quantity,
        ),
      );
      notifyListeners();
    }
  }
}
