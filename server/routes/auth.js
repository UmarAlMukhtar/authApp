const express = require("express");
const router = express.Router();
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { findAllByAltText } = require("@testing-library/react");

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, isProfileComplete: user.isProfileComplete },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),

  (req, res) => {
    const token = createToken(req.user);

    const redirectTo = req.user.isProfileComplete
      ? "/dashboard"
      : "/complete-profile";

    res.redirect(`${process.env.FRONTEND_URL}${redirectTo}?token=${token}`);
  },
);

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bycrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const token = createToken(user);

    res.json({
      token,
      isProfileComplete: user.isProfileComplete,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(401).json({
        error: "This account uses Google sign-in. Please continue with Google.",
      });
    }

    const isMatch = await bycrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = createToken(user);

    res.json({
      token,
      isProfileComplete: user.isProfileComplete,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/complete-profile", authMiddleware, async (req, res) => {
  const {
    firstName,
    lastName,
    displayName,
    dateOfBirth,
    profilePicture,
    role,
  } = req.body;

  if (!firstName || !lastName || !displayName || !dateOfBirth || !role) {
    return res.status(400).json({ error: "All profile fields are required" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName,
        lastName,
        displayName,
        dateOfBirth,
        profilePicture,
        role,
        isProfileComplete: true,
      },
      { returnDocument: "after" },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = createToken(user);

    const safeUser = await User.findById(user._id).select("-password");

    res.json({
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("Complete profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/test", async (req, res) => {
  const count = await User.countDocuments();
  res.json({ error: "Model works!", userCount: count });
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
