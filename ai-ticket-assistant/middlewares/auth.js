import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
        return res.status(401).json({error: "Access Denied. No token found"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next(); // continue to the next middleware
    } catch (error) {
        res.status(500).json({error: "Invalid token", message: error.message})
    }

}