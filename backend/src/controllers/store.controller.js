import Store from "../models/Store.Model.js";

// @desc    Create a new store for the logged-in coach
// @route   POST /api/stores
// @access  Private (Coach only)
export const createStore = async (req, res) => {
  try {
    const { name, description, logo, banner } = req.body;
    
    // Assume req.user.id is populated by your Auth Middleware
    const coachId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Store name is required." });
    }

    // Check if the coach already has a store (a coach should only have one store)
    const existingStore = await Store.findOne({ coach: coachId });
    if (existingStore) {
      return res.status(400).json({ message: "You already have a store created." });
    }

    // Create the new store
    const newStore = new Store({
      coach: coachId,
      name,
      description,
      logo,
      banner,
      // isActive and subscriptionPaid default to false based on the schema
    });

    await newStore.save();

    res.status(201).json({ 
        message: "Store created successfully. It will be active once the subscription is paid.", 
        store: newStore 
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to create store", error: error.message });
  }
};

// @desc    Get store details by Coach ID
// @route   GET /api/stores/:coachId
// @access  Public
export const getStore = async (req, res) => {
  try {
    const store = await Store.findOne({ coach: req.params.coachId }).populate('coach', 'name email');
    
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json({ store });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch store", error: error.message });
  }
};

// @desc    Update store details
// @route   PUT /api/stores
// @access  Private (Coach only)
export const updateStore = async (req, res) => {
  try {
    const { name, description, logo, banner } = req.body;
    const coachId = req.user.id;

    const store = await Store.findOne({ coach: coachId });
    
    if (!store) {
      return res.status(404).json({ message: "Store not found. Please create a store first." });
    }

    // Update fields
    store.name = name || store.name;
    store.description = description !== undefined ? description : store.description;
    if (logo) store.logo = logo; // Ensure handling URLs vs Multer correctly externally
    if (banner) store.banner = banner;

    const updatedStore = await store.save();

    res.status(200).json({
      message: "Store updated successfully",
      store: updatedStore
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update store", error: error.message });
  }
};