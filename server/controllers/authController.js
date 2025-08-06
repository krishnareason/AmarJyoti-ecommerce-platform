const db = require('../config/db');
const argon2 = require('argon2'); // Using argon2
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { name, email, password, phone, address, role } = req.body;
    if (!['consumer', 'wholesaler'].includes(role)) {
        return res.status(400).json({ msg: 'Invalid user role specified.' });
    }
    try {
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ msg: 'User with this email already exists.' });
        }

        // Use argon2 to hash the password
        const hashedPassword = await argon2.hash(password);

        const newUserQuery = `
            INSERT INTO users (name, email, password, phone, address, role) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING id, name, email, role`;
        const newUser = await db.query(newUserQuery, [name, email, hashedPassword, phone, address, role]);
        const payload = { user: { id: newUser.rows[0].id, role: newUser.rows[0].role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: newUser.rows[0] });
    } catch (err) {
        console.error('Signup Error:', err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }

        // Use argon2.verify to compare passwords
        const isMatch = await argon2.verify(user.password, password);
        
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }
        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        delete user.password;
        res.json({ token, user });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).send('Server error');
    }
};

exports.updateUserProfile = async (req, res) => {
    // We get the user's ID from the token to ensure they can only update their own profile
    const userId = req.user.id;
    const { name, phone, address } = req.body;

    try {
        const updateUserQuery = `
            UPDATE users 
            SET name = $1, phone = $2, address = $3 
            WHERE id = $4 
            RETURNING id, name, email, phone, address, role`;

        const updatedUser = await db.query(updateUserQuery, [name, phone, address, userId]);

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        res.json(updatedUser.rows[0]);

    } catch (err) {
        console.error('Update Profile Error:', err.message);
        res.status(500).send('Server Error');
    }
};