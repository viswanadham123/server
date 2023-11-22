const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://viswanadhamandala:vB9q828coydUI8bU@cluster0.mtqsuu8.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    });

const productSchema = new mongoose.Schema({
    id: String,
    productName: String,
    productCategory: String,
    imageUrl: String,
    productDescription: String,
});

const Product = mongoose.model('Product', productSchema);

// 1. Create an API to create a product
app.post('/products', async (req, res) => {
    const { id, productName, productCategory, imageUrl, productDescription } = req.body;

    try {
        const newProduct = new Product({
            id,
            productName,
            productCategory,
            imageUrl,
            productDescription,
        });
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 2. Create an API to fetch a product by product id
app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findOne({ id: productId });

        if (!product) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 3. Create an API to fetch all products with filters and pagination
app.get('/products', async (req, res) => {
    const { page, pageSize, productName, productCategory } = req.query;
    let query = {};

    if (productName) {
        query.productName = { $regex: new RegExp(productName, 'i') };
    }

    if (productCategory) {
        query.productCategory = { $regex: new RegExp(productCategory, 'i') };
    }

    try {
        const totalProducts = await Product.countDocuments(query);

        let paginatedProducts = [];
        if (page !== undefined && pageSize !== undefined) {
            const startIndex = (page - 1) * pageSize;
            paginatedProducts = await Product.find(query).skip(startIndex).limit(parseInt(pageSize));
        } else {
            paginatedProducts = await Product.find(query);
        }

        res.json({
            totalProducts,
            paginatedProducts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// 4. Create an API to delete a product by id
app.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const deletedProduct = await Product.findOneAndDelete({ id: productId });
        
        if (!deletedProduct) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json({ message: 'Product deleted successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB disconnected through app termination');
        process.exit(0);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
