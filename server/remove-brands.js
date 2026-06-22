const mongoose = require("mongoose");
const Product = require("./models/Product");

// Load environment variables (make sure your MONGO_URI is set in .env)
require('dotenv').config();

async function removeBrandField() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get count of products that have brand field
    const productCount = await Product.countDocuments({
      brand: { $exists: true }
    });
    console.log(`Found ${productCount} products with brand field`);

    // Remove brand field from all products
    const result = await Product.updateMany(
      {},
      { $unset: { brand: "" } }
    );
    
    console.log(`Removed brand field from ${result.modifiedCount} products`);
    console.log('Brand field removal completed successfully!');
  } catch (error) {
    console.error('Error during brand field removal:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the migration
removeBrandField();