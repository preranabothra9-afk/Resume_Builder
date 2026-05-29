import jwt from 'jsonwebtoken';
import User from '../models/User.models.js';

const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
}

const adminAuth = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('email');
        const adminEmail = process.env.ADMIN_EMAIL || "preranabothra9@gmail.com";
        if (!user || user.email !== adminEmail) {
            return res.status(403).json({ message: "Admin access required" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { protect, adminAuth };