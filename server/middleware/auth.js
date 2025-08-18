// --- File: server/middleware/auth.js ---
const jwt = require('jsonwebtoken');

// This middleware function verifies the JWT token sent by the client.
module.exports = function(req, res, next) {
    // Get token from the Authorization header, which is in the format "Bearer <token>"
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    
    // Check if token exists
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add user from payload to the request object
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};