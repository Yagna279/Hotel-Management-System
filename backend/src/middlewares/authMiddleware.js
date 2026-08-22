import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    console.log("====================================");
    console.log("AUTH MIDDLEWARE");
    console.log("====================================");

    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
      console.log("Authorization header missing");

      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("Authorization header is not Bearer");

      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    console.log("Token received:", true);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key"
    );

    console.log("Decoded JWT:", decoded);

    /*
     * IMPORTANT
     *
     * Your login controller creates JWT like:
     *
     * {
     *   id: customer.id,
     *   role: customer.role
     * }
     */

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    console.log("REQ.USER:", req.user);

    next();

  } catch (error) {

    console.error("====================================");
    console.error("AUTH MIDDLEWARE ERROR");
    console.error("====================================");
    console.error(error);
    console.error("====================================");

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;