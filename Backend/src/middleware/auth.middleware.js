const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const blacklistModel = require("../models/blacklist.model");

/**
 * Authenticates a request using a JWT.
 *
 * Reads the token from the `token` cookie (falling back to a
 * `Authorization: Bearer <token>` header), rejects it if it has been
 * blacklisted (logged out), verifies its signature, loads the matching user,
 * and attaches that user to `req.user` for downstream handlers.
 *
 * @param {import("express").Request} req - Express request. Expects the JWT in
 *   the `token` cookie or the `Authorization` header.
 * @param {import("express").Response} res - Express response.
 * @param {import("express").NextFunction} next - Express next callback.
 * @returns {Promise<void>} Calls `next()` on success, otherwise sends:
 *   - 401 if the token is missing, blacklisted, invalid, or the user no longer exists.
 */
async function authUser(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: no token provided" });
    }

    const isBlacklisted = await blacklistModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: "Unauthorized: token is no longer valid" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: user not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
}

module.exports = authUser;
