const { Router } = require("express");
const authController = require("../controller/auth.controller");
const authUser = require("../middleware/auth.middleware");

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

/**
 * @route POST /logout
 * @desc  Log the user out by blacklisting their JWT and clearing the auth cookie.
 * @access Public
 */
authRouter.post("/logout", authUser, authController.logoutUser);

/**
 * @route GET /get-me
 * @desc  Return the currently authenticated user's details.
 * @access Private (requires a valid JWT)
 */
authRouter.get("/get-me", authUser, authController.getMe);

module.exports = authRouter;