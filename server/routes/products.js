const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware } = require('./auth');

// GET all products
router.get('/', (req, res) => {
    const { category } = req.query;
    let products;
    if (category) {
        products = db.prepare('SELECT * FROM products WHERE category = ? ORDER BY id').all(category);
    } else {
        products = db.prepare('SELECT * FROM products ORDER BY id').all();
    }
    res.json(products);
});

// GET single product
router.get('/:id', (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
});

// POST create product (admin)
router.post('/', authMiddleware, (req, res) => {
    const { name, category, description, price, stock, image } = req.body;
    if (!name || !category || !price) {
        return res.status(400).json({ error: 'name, category, price required' });
    }
    const result = db.prepare(
        'INSERT INTO products (name, category, description, price, stock, image) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(name, category, description || '', price, stock || 0, image || 'default.jpg');
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
});

// PUT update product (admin)
router.put('/:id', authMiddleware, (req, res) => {
    const { name, category, description, price, stock, image } = req.body;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    db.prepare(`
    UPDATE products SET name=?, category=?, description=?, price=?, stock=?, image=?
    WHERE id=?
  `).run(
        name || existing.name,
        category || existing.category,
        description !== undefined ? description : existing.description,
        price || existing.price,
        stock !== undefined ? stock : existing.stock,
        image || existing.image,
        req.params.id
    );
    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updated);
});

// DELETE product (admin)
router.delete('/:id', authMiddleware, (req, res) => {
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Product deleted' });
});

module.exports = router;
