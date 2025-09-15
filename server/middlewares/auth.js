import { auth } from "../config/firebase.js";
import pool from "../config/db.js";

// Middleware to verify Firebase token and map to user_id
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  // console.log("Token received:", token);
  try {
    const decodedToken = await auth.verifyIdToken(token);
    const firebase_uid = decodedToken.uid;

    // Enforce email verification
    if (!decodedToken.email_verified) {
      return res.status(403).json({ error: "Forbidden: Email not verified" });
    }

    // Check if user exists in the database, if not create one
    const userQuery = `
      INSERT INTO users (firebase_uid, email, created_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (firebase_uid)
      DO UPDATE SET email = EXCLUDED.email
      RETURNING user_id;
    `;
    const userValues = [firebase_uid, decodedToken.email || null];
    const userResult = await pool.query(userQuery, userValues);
    const user_id = userResult.rows[0].user_id;

    // Attach user_id to request for use in routes
    req.user = { user_id, firebase_uid };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

export default authenticateToken;