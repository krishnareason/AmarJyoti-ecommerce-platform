const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import ALLLLL routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
// We can add orderRoutes later when we build it

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the AmarJyoti API!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));