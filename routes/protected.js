// routes/protected.js
const express = require('express');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.get('/protected-resource', verifyToken, (req, res) => {
    res.json({ message: 'Acceso al recurso protegido', user: req.user });
});

module.exports = router;
