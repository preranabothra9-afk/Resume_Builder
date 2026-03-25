import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/api_errors.js';

const protect = async (req, res, next) => {
    const token = req.headers.authorization;

    if(!token){
        throw new ApiError(400, "Unauthorized access");
    }

    // if token is there
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized access");
    }
}

export default protect;