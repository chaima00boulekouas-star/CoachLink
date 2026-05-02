import Product from "../Models/Product.Model.js";
import Store from "../Models/Store.Model.js";
import User from "../Models/User.Model.js";

// @desc    Add a new product to the coach's store
// @route   POST /api/products
// @access  Private (Coach only)
export const addProduct = async (req, res) => {
  try {
    const { title, description, category, price, type, stock } = req.body;
    const trainerId = req.user.id;

    if (!title || price === undefined || !type) {
      return res.status(400).json({ message: "Title, price, and type are required." });
    }

    if (price < 0) {
      return res.status(400).json({ message: "Price cannot be negative." });
    }

    let store = await Store.findOne({ trainer: trainerId });
    if (!store) {
      // Auto-create store for the trainer
      const trainer = await User.findById(trainerId);
      store = new Store({
        trainer: trainerId,
        name: trainer ? `${trainer.name}'s Store` : 'My Store',
        description: 'Training products and programs',
        isActive: true,
        subscriptionPaid: true,
      });
      await store.save();
    }

    // --- MULTER LOGIC: Handle uploaded images ---
    let imagesPaths = [];
    if (req.files && req.files.length > 0) {
      // Store relative path (uploads/filename) so it works as a URL
      imagesPaths = req.files.map((file) => 'uploads/' + file.filename);
    }

    const newProduct = new Product({
      store: store._id,
      trainer: trainerId,
      title,
      description,
      category,
      price,
      images: imagesPaths, // <-- Use the array of file paths here
      type,
      stock: type === "physical" ? stock : 0,
    });

    await newProduct.save();

    res.status(201).json({ 
        message: "Product added to your store successfully", 
        product: newProduct 
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to add product", error: error.message });
  }
};

// @desc    Get all products for a specific store
// @route   GET /api/products/store/:storeId
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ store: req.params.storeId, isActive: true })
      .populate('category', 'name'); 
      
    res.status(200).json({ count: products.length, products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

// @desc    Get all products across the platform
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.trainerId) {
      filter.trainer = req.query.trainerId;
    }
    
    const products = await Product.find(filter)
      .populate('trainer', 'name')
      .populate('category', 'name'); 
      
    res.status(200).json({ count: products.length, products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

// @desc    Get all products for the logged in trainer's store
// @route   GET /api/products/my-store
// @access  Private (Coach only)
export const getMyProducts = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const store = await Store.findOne({ trainer: trainerId });
    
    if (!store) {
      return res.status(200).json({ count: 0, products: [] }); // Return empty if no store yet
    }

    const products = await Product.find({ store: store._id })
      .populate('category', 'name'); 
      
    res.status(200).json({ count: products.length, products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your products", error: error.message });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('store', 'name logo')
      .populate('trainer', 'name')
      .populate('category', 'name');

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Trainer only)
export const updateProduct = async (req, res) => {
  try {
    const { title, description, category, price, type, stock, isActive } = req.body;
    const trainerId = req.user.id;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.trainer.toString() !== trainerId) {
      return res.status(401).json({ message: "Not authorized to update this product" });
    }

    if (price !== undefined && price < 0) {
      return res.status(400).json({ message: "Price cannot be negative." });
    }

    // --- MULTER LOGIC: Handle new uploaded images ---
    let imagesPaths = product.images; // Keep old images by default
    if (req.files && req.files.length > 0) {
      imagesPaths = req.files.map((file) => 'uploads/' + file.filename); // Replace with new ones if provided
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, category, price, type, stock, images: imagesPaths, isActive } },
      { new: true }
    );

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Trainer only)
export const deleteProduct = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verify ownership
    if (product.trainer.toString() !== trainerId) {
      return res.status(401).json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};