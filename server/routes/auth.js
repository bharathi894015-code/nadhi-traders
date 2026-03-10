const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database');

// --- AUTH MIDDLEWARE ---
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf8');
        const [email] = decoded.split(':');
        // Search in DB to ensure it's a real admin
        const admin = await db.adminByEmail(email);

        if (!admin) throw new Error('Invalid user');
        req.admin = admin; // Full admin record
        next();
    } catch (e) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

// --- SIGN UP API ---
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    try {
        // Check if user already exists
        const existing = await db.adminByEmail(email);
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.createAdmin({ email, password: hashedPassword });

        res.json({ success: true, message: 'Admin account created successfully' });
    } catch (e) {
        console.error('Signup error:', e);
        res.status(500).json({ success: false, message: 'Server error during signup' });
    }
});

// --- LOGIN API ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        // Find user by email
        const admin = await db.adminByEmail(email);

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Success - Generate a simple token (base64 of email+timestamp) – MVP level auth
        const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
        res.json({ success: true, token, message: 'Login successful' });

    } catch (e) {
        console.error('Login error:', e);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

// --- VERIFY TOKEN API ---
router.post('/verify', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ valid: false });

    try {
        const decoded = Buffer.from(token, 'base64').toString('utf8');
        const [email] = decoded.split(':');

        // Ensure email exists in DB
        const admin = await db.adminByEmail(email);

        if (admin) {
            return res.json({ valid: true });
        }
    } catch (e) { }

    res.status(401).json({ valid: false });
});

// --- PROFILE API (PROTECTED) ---
router.get('/me', authMiddleware, (req, res) => {
    // req.admin is set by authMiddleware (full record)
    res.json({
        success: true,
        admin: {
            id: req.admin.id,
            name: req.admin.name || '',
            email: req.admin.email,
            mobile: req.admin.mobile || '',
            whatsapp: req.admin.whatsapp || '',
            bio: req.admin.bio || '',
            createdAt: req.admin.createdAt || req.admin.created_at
        }
    });
});

router.put('/me', authMiddleware, async (req, res) => {
    const { name, email, password, mobile, whatsapp, bio } = req.body;
    const adminId = req.admin.id;

    try {
        const updateData = {};

        if (email) {
            const exists = await db.checkAdminEmailExists(email, adminId);
            if (exists) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
            updateData.email = email;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
            }
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (name !== undefined) updateData.name = name;
        if (mobile !== undefined) updateData.mobile = mobile;
        if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
        if (bio !== undefined) updateData.bio = bio;

        await db.updateAdmin(adminId, updateData);

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (e) {
        console.error('Profile update error:', e);
        res.status(500).json({ success: false, message: 'Server error during update' });
    }
});

module.exports = {
    router,
    authMiddleware
};
