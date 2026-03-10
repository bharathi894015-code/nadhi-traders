const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware } = require('./auth');

// GET all products
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const products = await db.products();
        if (category) {
            return res.json(products.filter(p => p.category === category));
        }
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// GET single product
router.get('/:id', async (req, res) => {
    try {
        const product = await db.product(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST create product (admin)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, category, description, price, stock, image } = req.body;
        if (!name || !category || !price) {
            return res.status(400).json({ error: 'name, category, price required' });
        }
        const product = await db.createProduct({ name, category, description: description || '', price: parseFloat(price), stock: parseInt(stock) || 0, image: image || 'default.jpg' });
        res.status(201).json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// PUT update product (admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { name, category, description, price, stock, image } = req.body;
        const product = await db.updateProduct(req.params.id, { name, category, description, price, stock, image });
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// DELETE product (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await db.deleteProduct(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
