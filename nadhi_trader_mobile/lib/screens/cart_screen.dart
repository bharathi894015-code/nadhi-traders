import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../cart_provider.dart';
import 'checkout_screen.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Shopping Cart'),
      ),
      body: cart.items.isEmpty
          ? const Center(child: Text('Your cart is empty!'))
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    itemCount: cart.items.length,
                    itemBuilder: (context, index) {
                      final item = cart.items[index];
                      return ListTile(
                        leading: Image.network(
                          'http://192.168.1.59:3000/uploads/${item.product.image}',
                          width: 50,
                          height: 50,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) =>
                              const Icon(Icons.image),
                        ),
                        title: Text(item.product.name),
                        subtitle: Text('₹${item.product.price} x ${item.quantity}'),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.remove_circle_outline),
                              onPressed: () => cart.updateQuantity(
                                  item.product.id, item.quantity - 1),
                            ),
                            Text('${item.quantity}'),
                            IconButton(
                              icon: const Icon(Icons.add_circle_outline),
                              onPressed: () => cart.updateQuantity(
                                  item.product.id, item.quantity + 1),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                Card(
                  margin: const EdgeInsets.all(16),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Total',
                                style: TextStyle(
                                    fontSize: 20, fontWeight: FontWeight.bold)),
                            Text('₹${cart.totalAmount.toStringAsFixed(2)}',
                                style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.green)),
                          ],
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.orange,
                              foregroundColor: Colors.white,
                            ),
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => const CheckoutScreen()),
                              );
                            },
                            child: const Text('PROCEED TO CHECKOUT'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}
