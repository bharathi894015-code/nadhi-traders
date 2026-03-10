import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'cart_provider.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CartProvider()),
      ],
      child: const NadhiTraderApp(),
    ),
  );
}

class NadhiTraderApp extends StatelessWidget {
  const NadhiTraderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nadhi Traders',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.green,
        primaryColor: const Color(0xFF2E7D32),
        scaffoldBackgroundColor: const Color(0xFFF5F5F5),
        useMaterial3: true,
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF2E7D32),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.green,
          primary: const Color(0xFF2E7D32),
          secondary: Colors.orangeAccent,
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
