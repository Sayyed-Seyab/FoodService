import UserSchema from "../Models/UserSchema";
import jwt from 'jsonwebtoken';

const IsUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET); // No need for `await`
        const user = await UserSchema.findById(decode.id || decode._id); // Use `id` if `_id` is not in the token payload

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role !== 'user') { // Ensure `role` is stored exactly as "user"
            return res.status(403).json({ success: false, message: 'Unauthorized user' });
        }

        req.user = user; // Attach user data to `req` for downstream access
        next(); // Pass control to the next middleware/route handler
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};