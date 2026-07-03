/**
 * Authentication routes.
 *
 * Mounts the endpoints for user registration and login onto an Express router.
 * @module routes/auth
 */
const { Router } = require("express");
const authController = require("../controller/auth.controller");

const authRouter = Router();

/**
 * @route POST /register
 * @desc  Register a new user and return a JWT.
 * @access Public
 */
authRouter.post("/register", authController.registerUser);

/**
 * @route POST /login
 * @desc  Authenticate an existing user and return a JWT.
 * @access Public
 */
authRouter.post("/login", authController.loginUser);

module.exports = authRouter;