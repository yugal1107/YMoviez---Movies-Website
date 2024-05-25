import { getUser } from "../controllers/authControllers.js";

function checkAuth(req, res, next) {
  console.log("Middleware running .......");
  const authorizationHeader = req.headers["Authorization"];
  req.user = null;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
    return next();
  }

  const token = authorizationHeader.split("Bearer ")[1];
  req.user = getUser(token);
  console.log(req.user);
  next();
}

export default checkAuth;
