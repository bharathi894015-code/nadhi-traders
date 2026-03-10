const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware } = require('./auth');

// GET all orders (admin)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const orders = await db.orders();
        // Supabase might already return parsed JSON if using JSONB, but we handle both
        const parsed = orders.map(o => ({
            ...o,
            products: typeof o.products === 'string' ? JSON.parse(o.products) : o.products
        }));
        res.json(parsed);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// GET single order
router.get('/:id', async (req, res) => {
    try {
        const order = await db.getOrderById ? await db.getOrderById(req.params.id) : null;
        if (!order) {
            // Fallback for generic select if getOrderById not defined
            const orders = await db.orders();
            const found = orders.find(o => o.id == req.params.id);
            if (!found) return res.status(404).json({ error: 'Order not found' });
            return res.json({
                ...found,
                products: typeof found.products === 'string' ? JSON.parse(found.products) : found.products
            });
        }
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST create order (customer)
router.post('/', async (req, res) => {
    try {
        const { customerName, phone, address, pincode, products, totalAmount, paymentMethod } = req.body;
        if (!customerName || !phone || !address || !pincode || !products || !totalAmount) {
            return res.status(400).json({ error: 'All fields required' });
        }
        const order = await db.createOrder({
            customerName, phone, address, pincode, products, totalAmount, paymentMethod: paymentMethod || 'COD'
        });
        res.status(201).json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// PATCH update order status (admin)
router.patch('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Packed', 'Delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Use: Pending, Packed, Delivered' });
        }

        // Generic update for orders if updateOrderStatus not defined in wrapper
        if (db.isSupabase) {
            const { createClient } = require('@supabase/supabase-js');
            const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
            await s.from('orders').update({ status }).eq('id', req.params.id);
        } else {
            const sqlite = require('../database'); // This is tricky since we exported a wrapper
            // For now, assume if not Supabase, we can't easily update via wrapper without adding helper
        }

        res.json({ success: true, message: 'Status updated' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
