import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class User {
  String username, role;

  User(this.username, this.role);

  factory User.fromJson(Map<String, dynamic> json) {
    return User(json['username'], json['role']);
  }
}

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<StatefulWidget> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
      ),
      body: Row(
        children: <Widget>[
          Expanded(
            child: Container(
              padding: const EdgeInsets.all(8.0),
              child: TextField(
                controller: _usernameController,
                decoration: InputDecoration(
                  labelText: 'Username',
                ),
              ),
            ),
          ),
          Expanded(
            child: Container(
              padding: const EdgeInsets.all(8.0),
              child: TextField(
                controller: _passwordController,
                decoration: InputDecoration(
                  labelText: 'Password',
                ),
              ),
            ),
          ),
          ElevatedButton(
            child: const Text('Login'),
            onPressed: () {
              _login(_usernameController.text, _passwordController.text);
            },
          ),
        ],
      ),
    );
  }

  _login(String username, String password) async {
    Uri uri = Uri.http('localhost:8080', '/login');
    final response = await http
        .post(uri, body: {'username': username, 'password': password});
    if (response.statusCode == 200) {
      final user = User.fromJson(json.decode(response.body));
      print(user.username);
      print(user.role);
      // Navigator.pushNamed(context, '/home', arguments: user);
    } else {
      print('Login failed');
    }
  }
}
