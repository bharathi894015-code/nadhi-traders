import 'package:flutter/material.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('About Us'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Center(
              child: Column(
                children: [
                  Icon(Icons.eco, size: 80, color: Color(0xFF2E7D32)),
                  SizedBox(height: 16),
                  Text(
                    'NADHI TRADERS',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF2E7D32),
                    ),
                  ),
                  Text(
                    'Premium Dry Fruits & Seeds',
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              'Our Story',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            const Text(
              'NADHI TRADERS is dedicated to providing premium quality dry fruits and healthy seeds directly from nature to your home. We believe in 100% natural, fresh products without preservatives or artificial colors.',
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 32),
            const Text(
              'Why Choose Us?',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _buildFeatureItem(Icons.nature, '100% Natural', 'No preservatives, no artificial colour'),
            _buildFeatureItem(Icons.inventory_2, 'Fresh Packaging', 'Sealed for maximum freshness'),
            _buildFeatureItem(Icons.home, 'Home Based', 'Small batch, personal care'),
            _buildFeatureItem(Icons.chat, 'Easy Ordering', 'Order online or via WhatsApp'),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureItem(IconData icon, String title, String desc) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFE8F5E9),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: const Color(0xFF2E7D32), size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Text(
                  desc,
                  style: const TextStyle(color: Colors.grey),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
