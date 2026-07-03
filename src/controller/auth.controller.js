const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Registers a new user.
 *
 * Validates the request body, ensures the email is not already taken, hashes
 * the password, persists the user, and issues a JWT that is also set as a cookie.
 *
 * @param {import("express").Request} req - Express request. Expects `req.body`
 *   to contain `username`, `email`, and `password`.
 * @param {import("express").Response} res - Express response.
 * @returns {Promise<void>} Sends a JSON response:
 *   - 400 if fields are missing or the user already exists.
 *   - 201 with `{ message, token }` on successful registration.
 */
async function registerUser(req, res) {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = new userModel({
        username,
        email,
        password: hash
    })

    await newUser.save();

    const token = jwt.sign(
        {id: newUser._id, username: newUser.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token", token)

    res.status(201).json({ message: "User registered successfully", token });
}

/**
 * Authenticates an existing user.
 *
 * Validates the request body, looks up the user by email, compares the supplied
 * password against the stored hash, and issues a JWT that is also set as a cookie.
 *
 * @param {import("express").Request} req - Express request. Expects `req.body`
 *   to contain `email` and `password`.
 * @param {import("express").Response} res - Express response.
 * @returns {Promise<void>} Sends a JSON response:
 *   - 400 if fields are missing or credentials are invalid.
 *   - 200 with `{ message, user }` on successful login.
 */
async function loginUser(req, res) {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token", token)

    res.status(200).json({ message: "User logged in successfully", user: {id: user._id, username: user.username} });
}

module.exports = {
    registerUser,
    loginUser
};