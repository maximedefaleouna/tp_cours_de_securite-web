import { JwtService } from "./jwt.js";

const jwtService = new JwtService();

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwtService.verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid or expired token.",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Unauthorized access.",
    });
  }
};

export default authMiddleware;
