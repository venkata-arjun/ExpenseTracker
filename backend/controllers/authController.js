const User = require("../models/User");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "..", "uploads");

const removeUploadedFileIfExists = (imageUrl) => {
  if (!imageUrl) return;

  try {
    const fileName = path.basename(imageUrl);
    const filePath = path.join(uploadsDir, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    // Ignore file cleanup errors so profile updates still succeed.
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User
exports.registerUser = async (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Invalid or missing request body" });
  }

  const { fullName, email, password, profileImageUrl } = req.body;

  // Validation: Check for missing fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create the user
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error logging in user", error: err.message });
  }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// Update Profile Photo
exports.updateProfilePhoto = async (req, res) => {
  const { profileImageUrl } = req.body;

  if (typeof profileImageUrl !== "string" || !profileImageUrl.trim()) {
    return res.status(400).json({ message: "profileImageUrl is required" });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const previousImageUrl = user.profileImageUrl;
    user.profileImageUrl = profileImageUrl.trim();
    await user.save();

    const safeUser = await User.findById(user._id).select("-password");

    if (previousImageUrl && previousImageUrl !== user.profileImageUrl) {
      removeUploadedFileIfExists(previousImageUrl);
    }

    return res.status(200).json({ user: safeUser });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating profile photo", error: err.message });
  }
};

// Delete Profile Photo
exports.deleteProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const previousImageUrl = user.profileImageUrl;
    user.profileImageUrl = null;
    await user.save();

    const safeUser = await User.findById(user._id).select("-password");

    removeUploadedFileIfExists(previousImageUrl);

    return res.status(200).json({ user: safeUser });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting profile photo", error: err.message });
  }
};
