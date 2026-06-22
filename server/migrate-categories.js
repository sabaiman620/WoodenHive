const mongoose = require("mongoose");
const Product = require("./models/Product");

// Load environment variables (make sure your MONGO_URI is set in .env)
require('dotenv').config();

// Category mapping: old -> new
const categoryMigration = {
  'men': 'office',
  'women': 'kitchen',
  'kids': 'gifts',
  'footwear': 'home'
};

async function migrateCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get count of products to migrate
    const productCount = await Product.countDocuments({
      category: { $in: Object.keys(categoryMigration) }
    });
    console.log(`Found ${productCount} products to migrate`);

    // Migrate each category
    for (const [oldCategory, newCategory] of Object.entries(categoryMigration)) {
      const result = await Product.updateMany(
        { category: oldCategory },
        { $set: { category: newCategory } }
      );
      console.log(`Migrated ${result.modifiedCount} products from '${oldCategory}' to '${newCategory}'`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the migration
migrateCategories();