import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../cart_provider.dart';
import '../api_service.dart';
import '../models.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  final _pincodeController = TextEditingController();
  bool _isProcessing = false;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _pincodeController.dispose();
    super.dispose();
  }

  void _submitOrder() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isProcessing = true);

    final cart = Provider.of<CartProvider>(context, listen: false);
    final order = Order(
      customerName: _nameController.text,
      phone: _phoneController.text,
      address: _addressController.text,
      pincode: _pincodeController.text,
      products: cart.items,
      totalAmount: cart.totalAmount,
    );

    try {
      final success = await ApiService().createOrder(order);
      if (success) {
        cart.clear();
        if (mounted) {
          _showSuccessDialog();
        }
      } else {
        throw Exception('Failed to place order');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isProcessing = false);
      }
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text('Order Placed!'),
        content: const Text('Your order has been successfully placed. We will contact you soon.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).popUntil((route) => route.isFirst);
            },
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: _isProcessing
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(labelText: 'Full Name'),
                      validator: (v) => v!.isEmpty ? 'Enter your name' : null,
                    ),
                    TextFormField(
                      controller: _phoneController,
                      decoration: const InputDecoration(labelText: 'Phone Number'),
                      keyboardType: TextInputType.phone,
                      validator: (v) => v!.isEmpty ? 'Enter your phone' : null,
                    ),
                    TextFormField(
                      controller: _addressController,
                      decoration: const InputDecoration(labelText: 'Address'),
                      maxLines: 3,
                      validator: (v) => v!.isEmpty ? 'Enter your address' : null,
                    ),
                    TextFormField(
                      controller: _pincodeController,
                      decoration: const InputDecoration(labelText: 'Pincode'),
                      keyboardType: TextInputType.number,
                      validator: (v) => v!.isEmpty ? 'Enter pincode' : null,
                    ),
                    const SizedBox(height: 32),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2E7D32),
                          foregroundColor: Colors.white,
                        ),
                        onPressed: _submitOrder,
                        child: const Text('PLACE ORDER'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
