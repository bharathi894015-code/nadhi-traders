import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class ContactScreen extends StatelessWidget {
  const ContactScreen({super.key});

  Future<void> _launchUrl(String url) async {
    if (!await launchUrl(Uri.parse(url))) {
      throw Exception('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Contact Us'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Get in Touch',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'We are here to help you with your health journey.',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 32),
            _buildContactCard(
              Icons.chat,
              'WhatsApp',
              '+91-8838740081',
              () => _launchUrl('https://wa.me/918838740081?text=Hi! I want to order from NADHI TRADERS'),
              color: const Color(0xFF25D366),
            ),
            const SizedBox(height: 16),
            _buildContactCard(
              Icons.email,
              'Email',
              'bharathisharmila6@gmail.com',
              () => _launchUrl('mailto:bharathisharmila6@gmail.com'),
              color: Colors.blue,
            ),
            const SizedBox(height: 16),
            _buildContactCard(
              Icons.access_time,
              'Business Hours',
              'Mon–Sat, 9 AM – 7 PM',
              null,
              color: Colors.orange,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContactCard(IconData icon, String title, String value, VoidCallback? onTap, {required Color color}) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: CircleAvatar(
          backgroundColor: color.withValues(alpha: 0.1),
          child: Icon(icon, color: color),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(value),
        trailing: onTap != null ? const Icon(Icons.chevron_right) : null,
        onTap: onTap,
      ),
    );
  }
}
