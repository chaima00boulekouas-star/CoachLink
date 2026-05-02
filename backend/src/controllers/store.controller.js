import Store from "../Models/Store.Model.js";

// @desc    Create a new store for the logged-in coach
// @route   POST /api/stores
// @access  Private (Coach only)
export const createStore = async (req, res) => {
  try {
    const { name, description } = req.body;
    const trainerId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Store name is required." });
    }

    const existingStore = await Store.findOne({ trainer: trainerId });
    if (existingStore) {
      return res.status(400).json({ message: "You already have a store created." });
    }

    // --- MULTER LOGIC: Extract logo and banner paths ---
    let logoPath = "";
    let bannerPath = "";

    // Since we will use upload.fields() in the router, the files are accessed like this:
    if (req.files) {
      if (req.files.logo) logoPath = req.files.logo[0].path;
      if (req.files.banner) bannerPath = req.files.banner[0].path;
    }

    const newStore = new Store({
      trainer: trainerId,
      name,
      description,
      logo: logoPath,     // <-- Saved as file path
      banner: bannerPath, // <-- Saved as file path
    });

    await newStore.save();

    res.status(201).json({ 
        message: "Store created successfully.", 
        store: newStore 
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to create store", error: error.message });
  }
};

// @desc    Get store details by Trainer ID
// @route   GET /api/stores/:trainerId
// @access  Public
export const getStore = async (req, res) => {
  try {
    const store = await Store.findOne({ trainer: req.params.trainerId || req.params.coachId }).populate('trainer', 'name email');
    
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
    const { name, description } = req.body;
    const trainerId = req.user.id;

    const store = await Store.findOne({ trainer: trainerId });
    
    if (!store) {
      return res.status(404).json({ message: "Store not found." });
    }

    store.name = name || store.name;
    store.description = description !== undefined ? description : store.description;

    // --- MULTER LOGIC: Update logo and banner if new ones are uploaded ---
    if (req.files) {
      if (req.files.logo) store.logo = req.files.logo[0].path;
      if (req.files.banner) store.banner = req.files.banner[0].path;
    }

    const updatedStore = await store.save();

    res.status(200).json({
      message: "Store updated successfully",
      store: updatedStore
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update store", error: error.message });
  }
};