import { getUser } from "../controllers/authControllers.js";

function checkAuth(req, res, next) {
  console.log("Middleware running .......");
  console.log(req.cookies);
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
  console.log("Token : ", token);
  req.user = null;

  if (!token) {
    return next();
  }
  req.user = getUser(token);
  console.log(req.user);
  next();
}

export default checkAuth;
