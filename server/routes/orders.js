const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware } = require('./auth');

// GET all orders (admin)
router.get('/', authMiddleware, (req, res) => {
    const orders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
    const parsed = orders.map(o => ({ ...o, products: JSON.parse(o.products) }));
    res.json(parsed);
});

// GET single order
router.get('/:id', (req, res) => {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ ...order, products: JSON.parse(order.products) });
});

// POST create order (customer)
router.post('/', (req, res) => {
    const { customerName, phone, address, pincode, products, totalAmount, paymentMethod } = req.body;
    if (!customerName || !phone || !address || !pincode || !products || !totalAmount) {
        return res.status(400).json({ error: 'All fields required' });
    }
    const result = db.prepare(`
    INSERT INTO orders (customerName, phone, address, pincode, products, totalAmount, paymentMethod)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(customerName, phone, address, pincode, JSON.stringify(products), totalAmount, paymentMethod || 'COD');

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...order, products: JSON.parse(order.products) });
});

// PATCH update order status (admin)
router.patch('/:id/status', (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Packed', 'Delivered'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Use: Pending, Packed, Delivered' });
    }
    const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Order not found' });

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    res.json({ ...updated, products: JSON.parse(updated.products) });
});

module.exports = router;
