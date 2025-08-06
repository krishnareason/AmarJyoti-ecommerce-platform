module.exports = function(req, res, next) {
    // req.user is attached by the authMiddleware that runs before this
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed
    } else {
        res.status(403).json({ msg: 'Access denied. Not an admin.' });
    }
};