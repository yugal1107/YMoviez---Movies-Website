import { getUser } from "../controllers/auth-controllers";

function checkAuth(req,res,next){
    const authorizationHeader = req.headers["Authorization"];
    req.user = null;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")){
        return next();
    }

    const token = authorizationHeader.split("Bearer ")[1];
    req.user = getUser(token);
    next();
}


export default checkAuth;