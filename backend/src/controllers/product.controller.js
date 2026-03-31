import Product from "../Models/Product.Model.js";
import Store from "../Models/Store.Model.js";

// @desc    Add a new product to the coach's store
// @route   POST /api/products
// @access  Private (Coach only)
export const addProduct = async (req, res) => {
  try {
    const { title, description, category, price, type, stock } = req.body;
    const coachId = req.user.id;

    if (!title || price === undefined || !type) {
      return res.status(400).json({ message: "Title, price, and type are required." });
    }

    if (price < 0) {
      return res.status(400).json({ message: "Price cannot be negative." });
    }

    const store = await Store.findOne({ coach: coachId });
    if (!store) {
      return res.status(404).json({ message: "Store not found. Please create a store first." });
    }

    // --- MULTER LOGIC: Handle uploaded images ---
    let imagesPaths = [];
    if (req.files && req.files.length > 0) {
      // Loop through uploaded files and extract their paths
      imagesPaths = req.files.map((file) => file.path);
    }

    const newProduct = new Product({
      store: store._id,
      coach: coachId,
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

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('store', 'name logo')
      .populate('coach', 'name')
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
// @access  Private (Coach only)
export const updateProduct = async (req, res) => {
  try {
    const { title, description, category, price, type, stock, isActive } = req.body;
    const coachId = req.user.id;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.coach.toString() !== coachId) {
      return res.status(401).json({ message: "Not authorized to update this product" });
    }

    if (price !== undefined && price < 0) {
      return res.status(400).json({ message: "Price cannot be negative." });
    }

    // --- MULTER LOGIC: Handle new uploaded images ---
    let imagesPaths = product.images; // Keep old images by default
    if (req.files && req.files.length > 0) {
      imagesPaths = req.files.map((file) => file.path); // Replace with new ones if provided
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
// @access  Private (Coach only)
export const deleteProduct = async (req, res) => {
  try {
    const coachId = req.user.id;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verify ownership
    if (product.coach.toString() !== coachId) {
      return res.status(401).json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};