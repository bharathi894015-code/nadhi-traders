import 'dart:convert';
import 'package:http/http.dart' as http;
import 'models.dart';

class ApiService {
  // For Android Emulator, use 10.0.2.2. For real device, use your local IP.
  static const String baseUrl = 'http://192.168.1.59:3000/api';

  Future<List<Product>> getProducts() async {
    final response = await http.get(Uri.parse('$baseUrl/products'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Product.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load products');
    }
  }

  Future<bool> createOrder(Order order) async {
    final response = await http.post(
      Uri.parse('$baseUrl/orders'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(order.toJson()),
    );
    return response.statusCode == 201 || response.statusCode == 200;
  }
}
