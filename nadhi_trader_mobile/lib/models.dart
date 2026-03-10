class Product {
  final int id;
  final String name;
  final String category;
  final String? description;
  final double price;
  final int stock;
  final String image;

  Product({
    required this.id,
    required this.name,
    required this.category,
    this.description,
    required this.price,
    required this.stock,
    required this.image,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      category: json['category'],
      description: json['description'],
      price: (json['price'] as num).toDouble(),
      stock: json['stock'],
      image: json['image'] ?? 'default.jpg',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'description': description,
      'price': price,
      'stock': stock,
      'image': image,
    };
  }
}

class CartItem {
  final Product product;
  int quantity;

  CartItem({
    required this.product,
    this.quantity = 1,
  });

  double get total => product.price * quantity;
}

class Order {
  final int? id;
  final String customerName;
  final String phone;
  final String address;
  final String pincode;
  final List<CartItem> products;
  final double totalAmount;
  final String paymentMethod;
  final String status;
  final String? createdAt;

  Order({
    this.id,
    required this.customerName,
    required this.phone,
    required this.address,
    required this.pincode,
    required this.products,
    required this.totalAmount,
    this.paymentMethod = 'COD',
    this.status = 'Pending',
    this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'customerName': customerName,
      'phone': phone,
      'address': address,
      'pincode': pincode,
      'products': products.map((item) => {
        'id': item.product.id,
        'name': item.product.name,
        'price': item.product.price,
        'quantity': item.quantity,
      }).toList(),
      'totalAmount': totalAmount,
      'paymentMethod': paymentMethod,
    };
  }
}
