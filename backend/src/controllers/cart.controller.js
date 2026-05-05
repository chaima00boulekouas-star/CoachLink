import Cart from "../Models/Cart.Model.js";
import Product from "../Models/Product.Model.js";

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
      select: "title price images trainer store type stock",
      populate: { path: "trainer", select: "name" }
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Format for frontend
    const formattedItems = cart.items.map(item => {
      if (!item.product) return null;
      return {
        id: item._id,
        _id: item._id,
        productId: item.product._id,
        product: item.product._id,
        title: item.product.title,
        price: item.product.price,
        image: item.product.images?.[0] || "",
        coach: item.product.trainer?.name || "Trainer",
        qty: item.quantity,
        stock: item.product.stock,
        type: item.product.type
      };
    }).filter(Boolean);

    res.status(200).json({ items: formattedItems });
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart", error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = quantity || 1;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add item", error: error.message });
  }
};

// @desc    Update item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Quantity updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity", error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error: error.message });
  }
};
